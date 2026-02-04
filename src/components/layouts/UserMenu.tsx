import { Avatar, AvatarFallback, AvatarImage } from '@vritti/quantum-ui/Avatar';
import { DropdownMenu, type MenuItem } from '@vritti/quantum-ui/DropdownMenu';
import { Lock, LogOut, User } from 'lucide-react';

// Placeholder user data
const PLACEHOLDER_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined, // Can be set to an image URL
  role: 'Admin',
};

export const UserMenu = () => {
  const userInitials = PLACEHOLDER_USER.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
        <div className="flex items-start gap-3 px-2 py-2">
          <Avatar className="h-10 w-10">
            {PLACEHOLDER_USER.avatar && <AvatarImage src={PLACEHOLDER_USER.avatar} alt={PLACEHOLDER_USER.name} />}
            <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none truncate">{PLACEHOLDER_USER.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{PLACEHOLDER_USER.email}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {PLACEHOLDER_USER.role}
              </span>
            </p>
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
        },
        {
          type: 'item',
          id: 'password-auth',
          label: 'Password & Authentication',
          icon: Lock,
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
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        ),
      }}
      items={menuItems}
      contentClassName="w-64"
      align="end"
    />
  );
};
