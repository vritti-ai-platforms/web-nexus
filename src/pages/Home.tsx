import { useAuth } from '@vritti/quantum-ui';
import { LogOut, User } from 'lucide-react';

export const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Vritti</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-foreground">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Vritti!</h2>
          <p className="text-muted-foreground text-lg mb-6">You are successfully logged in.</p>

          <div className="bg-muted/50 rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-3">User Information</h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium text-foreground w-24">Name:</span>
                <span className="text-muted-foreground">{user?.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-foreground w-24">Email:</span>
                <span className="text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-foreground w-24">ID:</span>
                <span className="text-muted-foreground">{user?.id}</span>
              </div>
              {user?.role && (
                <div className="flex">
                  <span className="font-medium text-foreground w-24">Role:</span>
                  <span className="text-muted-foreground">{user.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
