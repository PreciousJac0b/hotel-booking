import User from '../models/User.js';
import { Webhoook } from 'svix';

const clerkWebhooks = async (req, res) => {
    try {
        // Create SVIX with clerk webhook secret
        const whook = new webhook(process.env.CLERK_WEBHOOK_SECRET);
        // Getting Headers
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        }
        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        const { type, data } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.profile_image_url,
            // role: "user",
            // recentSearchedCities: [],
        }

        // Switch Case for different webhook events
        switch (type) {
            case 'user.created':
                // Create a new user in the database
                await User.create(userData);
                break;
            case 'user.updated':
                // Update the existing user in the database
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case 'user.deleted':
                // Delete the user from the database
                await User.findByIdAndDelete(data.id);
                break;
            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }

        res.status(200).json({ 
            success: true,
            message: 'Webhook processed successfully'
         });

    } catch (error) {
        console.error('Error processing Clerk webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default clerkWebhooks;