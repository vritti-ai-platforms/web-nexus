import { Avatar, AvatarFallback, AvatarImage } from '@vritti/quantum-ui/Avatar';
import { DropdownMenu, type MenuItem } from '@vritti/quantum-ui/DropdownMenu';
import { useTheme } from '@vritti/quantum-ui/hooks';
import { ThemeToggle } from '@vritti/quantum-ui/ThemeToggle';
import { Lock, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Placeholder user data
const PLACEHOLDER_USER = {
  name: 'Shashank Raju Parthikantam',
  email: 'john@example.com',
  avatar: undefined, // Can be set to an image URL
  role: 'Admin',
};

export const UserMenu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const userInitials = PLACEHOLDER_USER.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleProfileClick = () => {
    navigate('/account/profile');
  };

  const handleSecurityClick = () => {
    navigate('/account/security');
  };

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    // 1. Call logout API endpoint
    // 2. Clear quantum-ui token
    // 3. Redirect to /login
    console.log('Sign out clicked');
  };

  // Define menu items using declarative structure
  const menuItems: MenuItem[] = [
    {
      type: 'custom',
      id: 'user-info',
      render: (
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10">
            {PLACEHOLDER_USER.avatar && <AvatarImage src={PLACEHOLDER_USER.avatar} alt={PLACEHOLDER_USER.name} />}
            <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
            <div className="flex flex-col space-y-1 min-w-0">
              <p className="text-sm font-semibold leading-none truncate">{PLACEHOLDER_USER.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{PLACEHOLDER_USER.email}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary flex-shrink-0">
              {PLACEHOLDER_USER.role}
            </span>
          </div>
        </div>
      ),
    },
    { type: 'separator' },
    {
      type: 'group',
      id: 'account-group',
      label: 'Account',
      items: [
        {
          type: 'item',
          id: 'profile',
          label: 'Profile',
          icon: User,
          onClick: handleProfileClick,
        },
        {
          type: 'item',
          id: 'password-auth',
          label: 'Password & Authentication',
          icon: Lock,
          onClick: handleSecurityClick,
        },
      ],
    },

    { type: 'separator' },
    {
      type: 'group',
      id: 'appearance-group',
      label: 'Appearance',
      items: [
        {
          type: 'custom',
          id: 'theme-toggle',
          asMenuItem: false,
          render: (
            <div className="flex items-center justify-between w-full px-2 py-1.5">
              <span className="text-sm">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              <ThemeToggle size="sm" />
            </div>
          ),
        },
      ],
    },

    { type: 'separator' },
    {
      type: 'item',
      id: 'signout',
      label: 'Sign out',
      icon: LogOut,
      onClick: handleSignOut,
      variant: 'destructive',
      shortcut: '⇧⌘Q',
    },
  ];

  return (
    <DropdownMenu
      trigger={{
        children: (
          <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80" aria-label="User menu">
            {PLACEHOLDER_USER.avatar && <AvatarImage src={PLACEHOLDER_USER.avatar} alt={PLACEHOLDER_USER.name} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
        ),
      }}
      items={menuItems}
      contentClassName="w-64"
      align="end"
      modal={false}
    />
  );
};
