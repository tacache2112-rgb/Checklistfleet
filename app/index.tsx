import { Redirect } from 'expo-router';

export default function Index() {
    // Redireciona para a página de login/registro
    return <Redirect href="/auth" />;
}
