import whenAPokemonIsLikedCreateNotifications from '../utils/whenAPokemonIsLikedCreateNotifications';
import { isAdmin, isAdminFieldLevel } from '../access/IsAdmins';
import { isAdminOrUser, isUserFieldLevel } from '../access/IsAdminsAndUsers';
import type { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      sameSite: "none",
      secure: false,
    }
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    read: isAdminOrUser,
    update: isAdminOrUser,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      access: {
        update: isAdminFieldLevel,
      },
      defaultValue: ['user'],
      options: ['admin', 'user'],
    },
    {
      name: 'likedPokemons',
      type: 'array',
      minRows: 0,
      access: {
        read: isUserFieldLevel,
        update: isUserFieldLevel
      },
      fields: [
        {
          name: "id",
          type: "text",
        },
      ],
    },
    {
      name: 'notifications',
      type: 'array',
      minRows: 0,
      access: {
        read: isUserFieldLevel,
        update: isUserFieldLevel
      },
      fields: [
        {
          name: "id",
          type: "text",
        },
        {
          name: "likedBy",
          type: "text",
        },
        {
          name: "createdAt",
          type: "date",
        },
        {
          name: "pokemonId",
          type: "text",
        },
        {
          name: "acknowledged",
          type: "checkbox"
        }
      ],
    },
  ],
  endpoints: [
    {
      path: "/likedPokemon/:id",
      method: "post",
      handler: async (req, res, next) => {
        const { id: pokemonId } = req.params;
        const { userId } = req.body;
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const user = await req.payload.findByID({
          collection: 'users',
          id: userId,
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }


        if (user.likedPokemons?.find(({ id }) => id === pokemonId)) {
          return res.status(400).json({ error: "User already likes this pokemon" });
        }

        const updatedLikedPokemons = [...(user.likedPokemons || []), { id: pokemonId }];

        const updatedUser = await req.payload.update({
          collection: 'users',
          id: userId,
          data: { likedPokemons: updatedLikedPokemons },
        });

        whenAPokemonIsLikedCreateNotifications(pokemonId, userId, req);

        res.status(200).json(updatedUser);
      },
    },
    {
      path: "/acknowledgeNotifications",
      method: "post",
      handler: async (req, res, next) => {
        const { userId, notificationIds } = req.body;
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const user = await req.payload.findByID({
          collection: 'users',
          id: userId,
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const notifications = user.notifications?.filter(({ id }) => notificationIds.includes(id!));

        if (!notifications) {
          return res.status(404).json({ error: "Notification not found" });
        }

        notifications.forEach((notification) => notification.acknowledged = true);

        const updatedUser = await req.payload.update({
          collection: 'users',
          id: userId,
          data: { notifications: user.notifications },
        });

        res.status(200).json(updatedUser);
      },
    }
  ],
};



export default Users;