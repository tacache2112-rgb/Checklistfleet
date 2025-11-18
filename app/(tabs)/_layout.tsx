import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { user, isAuthenticated } = useAuth();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,

                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderTopColor: Colors[colorScheme ?? 'light'].border,
                },
            }}
        >
            <Tabs.Screen
                name="checklist"
                options={{
                    title: 'Checklists',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="checkmark.circle.fill"
                            color={color}
                        />
                    ),
                }}
            />

            {isAuthenticated && user?.role === 'admin' && (
                <Tabs.Screen
                    name="pessoal"
                    options={{
                        title: 'Pessoal',
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="person.fill"
                                color={color}
                            />
                        ),
                    }}
                />
            )}

            {isAuthenticated && user?.role !== 'admin' && (
                <Tabs.Screen
                    name="pessoal"
                    options={{
                        title: 'Pessoal',
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="person.fill"
                                color={color}
                            />
                        ),
                    }}
                />
            )}
        </Tabs>
    );
}
