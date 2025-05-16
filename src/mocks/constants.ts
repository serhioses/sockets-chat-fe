import { TMessage } from '@/types/chat';
import { TUser } from '@/types/user';

export const MOCK_TOKEN = 'mock_token';

export const MOCK_USER: TUser = {
    id: '1',
    fullName: 'Test user',
    email: 'test@mail.com',
    avatar: '',
    createdAt: '2000-09-14T10:08:13.799Z',
};

export const MOCK_AVATAR_URL = 'https://example.com/avatar.png';

export const MOCK_USER_LIST: TUser[] = [
    {
        id: '2',
        fullName: 'Oliver Mayer',
        email: 'oliver@mail.com',
        avatar: '',
        createdAt: '2002-10-09T10:08:13.799Z',
    },
    {
        id: '3',
        fullName: 'Megan Lee',
        email: 'megan@mail.com',
        avatar: '',
        createdAt: '2016-12-23T10:08:13.799Z',
    },
];

export const MOCK_MESSAGE: TMessage = {
    _id: '4',
    createdAt: '2000-09-14T10:08:13.799Z',
    receiverId: '2',
    senderId: '1',
    text: 'New message',
};

export const MOCK_MESSAGE_HISTORY: TMessage[] = [
    {
        _id: '1',
        createdAt: '2000-09-14T10:08:13.799Z',
        receiverId: '2',
        senderId: '1',
        text: 'Hello',
    },
    {
        _id: '2',
        createdAt: '2000-09-14T10:08:13.799Z',
        receiverId: '1',
        senderId: '2',
        text: 'Hi back',
    },
    {
        _id: '3',
        createdAt: '2000-09-14T10:08:13.799Z',
        receiverId: '2',
        senderId: '1',
        text: 'Sending image',
        image: 'https://fastly.picsum.photos/id/909/200/200.jpg?hmac=MBq84AuRxQbIS381LPxRbG5b7THHQUSRuIupyC6IJGg',
    },
];
