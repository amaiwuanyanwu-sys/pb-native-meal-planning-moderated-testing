export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amelia Garcia',
    email: 'amelia.garcia@example.com',
    initials: 'AG',
    avatarColor: '#952abd', // plum-600
  },
  {
    id: '2',
    name: 'Benjamin Kim',
    email: 'benjamin.kim@example.com',
    initials: 'BK',
    avatarColor: '#00bd4c', // spring-600
  },
  {
    id: '3',
    name: 'Charlotte Davis',
    email: 'charlotte.davis@example.com',
    initials: 'CD',
    avatarColor: '#219ec4', // lake-600
  },
  {
    id: '4',
    name: 'Daniel Martinez',
    email: 'daniel.martinez@example.com',
    initials: 'DM',
    avatarColor: '#fd7800', // tangerine-600
  },
  {
    id: '5',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    initials: 'EJ',
    avatarColor: '#dc1c46', // rose-600
  },
];
