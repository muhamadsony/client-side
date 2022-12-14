import './App.css'
import { Link, Outlet } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { AuthContext } from './context/AuthContext'
import { useMemo, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { NotificationsProvider } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

function App() {
  const { signIn, signOut, user, resetToken } = useAuth()
  const value = useMemo(() => ({ user, signIn, signOut, resetToken }))

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Noto Sans , sans-serif',
          spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
          colorScheme: 'light',
          primaryColor: 'blue',
          defaultRadius: 0,
          headings: {
            fontFamily: 'Monospace',
            fontWeight: 1000
          },
          components: {
            Button: {
              styles: (theme, params) => ({
                root: {
                  height: 42,
                  padding: '0,30px',
                  backgroundColor: params.variant === 'filled' ? theme.colors[params.color || theme.primaryColor[9]] : undefined,
                },
              })
            },
          },
        }}>


        <AuthContext.Provider value={value} >

          <NotificationsProvider>

            <ModalsProvider>

              <Outlet />

            </ModalsProvider>

          </NotificationsProvider>

        </AuthContext.Provider>

      </MantineProvider>

    </>
  );
}

export default App;
