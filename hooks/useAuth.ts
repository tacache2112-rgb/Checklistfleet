import {
    AuthState,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '@/types/auth';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'checklistfleet_auth';
const USERS_KEY = 'checklistfleet_users';

// Simulando um backend - em produção, isso seria uma API real
const generateJWT = (user: User): string => {
    const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const decodeJWT = (token: string): User | null => {
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Erro ao decodificar JWT:', error);
        return null;
    }
};

const initializeDefaultAdmin = async () => {
    try {
        const usersJson = await SecureStore.getItemAsync(USERS_KEY);
        if (!usersJson) {
            const adminUser: User = {
                id: 'admin-001',
                email: 'admin@example.com',
                name: 'Administrador',
                role: 'admin',
                createdAt: new Date().toISOString(),
            };
            await SecureStore.setItemAsync(
                USERS_KEY,
                JSON.stringify([adminUser]),
            );
        }
    } catch (error) {
        console.error('Erro ao inicializar admin:', error);
    }
};

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        user: null,
        isAuthenticated: false,
    });
    const [loading, setLoading] = useState(true);

    // Carregar auth state do storage ao iniciar
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                await initializeDefaultAdmin();

                const token = await SecureStore.getItemAsync(STORAGE_KEY);
                if (token) {
                    const user = decodeJWT(token);
                    if (user) {
                        setAuthState({
                            token,
                            user,
                            isAuthenticated: true,
                        });
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar auth state:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthState();
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        try {
            // Recuperar usuários existentes
            const usersJson = await SecureStore.getItemAsync(USERS_KEY);
            const users: User[] = usersJson ? JSON.parse(usersJson) : [];

            // Verificar se email já existe
            if (users.some((u) => u.email === credentials.email)) {
                throw new Error('Email já registrado');
            }

            // Criar novo usuário
            const newUser: User = {
                id: Date.now().toString(),
                email: credentials.email,
                name: credentials.name,
                role: 'user', // Novo usuário começa como 'user', não 'admin'
                createdAt: new Date().toISOString(),
            };

            // Salvar usuário
            users.push(newUser);
            await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(users));

            // Gerar JWT
            const token = generateJWT(newUser);
            await SecureStore.setItemAsync(STORAGE_KEY, token);

            setAuthState({
                token,
                user: newUser,
                isAuthenticated: true,
            });

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return { success: false, error: (error as Error).message };
        }
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            // Recuperar usuários salvos
            const usersJson = await SecureStore.getItemAsync(USERS_KEY);
            const users: User[] = usersJson ? JSON.parse(usersJson) : [];

            // Encontrar usuário (em produção, seria verificação de senha com hash)
            const user = users.find((u) => u.email === credentials.email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Gerar JWT
            const token = generateJWT(user);
            await SecureStore.setItemAsync(STORAGE_KEY, token);

            setAuthState({
                token,
                user,
                isAuthenticated: true,
            });

            return { success: true, user };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, error: (error as Error).message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            setAuthState({
                token: null,
                user: null,
                isAuthenticated: false,
            });
            return { success: true };
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return { success: false, error: (error as Error).message };
        }
    }, []);

    return {
        ...authState,
        loading,
        register,
        login,
        logout,
    };
};
