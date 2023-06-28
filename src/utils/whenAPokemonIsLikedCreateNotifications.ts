import { User } from 'payload/generated-types'

const whenAPokemonIsLikedCreateNotifications = async (pokemonId: string, userId: string, req: any) => {
    const usersWantingNotifications = await findUsersWantingNotification(pokemonId, req)
    const likedByuser = await req.payload.findByID({
        collection: 'users',
        id: userId
    });
    
    for (const user of usersWantingNotifications) {
        const newNotification = {
            createdAt: new Date().toISOString(),
            likedBy: likedByuser.email,
            pokemonId: pokemonId.toString(),
            acknowledged: false,
        };
        const updatedNotifications = [...(user.notifications || []), newNotification];

        await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { notifications: updatedNotifications },
        });
    }
}


const findUsersWantingNotification = async (pokemonId: string, req: any): Promise<User[]> => {
    const users = await req.payload.find({
        collection: 'users',
    });

    const usersWantingNotification = users.docs.filter((user: any) =>
        Array.isArray(user.likedPokemons) && user.likedPokemons.some((pokemon: any) => pokemon.id === pokemonId)
    );
    const { userId } = req.body;

    return usersWantingNotification.filter((user: User) => user.id !== userId);
}

export default whenAPokemonIsLikedCreateNotifications;