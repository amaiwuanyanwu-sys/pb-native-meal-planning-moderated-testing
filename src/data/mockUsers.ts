export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amelia Garcia',
    initials: 'AG',
    avatarColor: '#B24CCD',
  },
  {
    id: '2',
    name: 'Benjamin Kim',
    initials: 'BK',
    avatarColor: '#1E8754',
  },
  {
    id: '3',
    name: 'Charlotte Davis',
    initials: 'CD',
    avatarColor: '#1570EF',
  },
  {
    id: '4',
    name: 'Daniel Martinez',
    initials: 'DM',
    avatarColor: '#E57A00',
  },
  {
    id: '5',
    name: 'Emily Johnson',
    initials: 'EJ',
    avatarColor: '#C11A1C',
  },
];
