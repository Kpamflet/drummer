import medusaServer from "./medusa.server";
import { getSession } from "./session.server";

export const customerAuthCheck = async (request: Request) => {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);
    const cid = session.get('cid');
    console.log("Session CID", cid);
    
    if (cid) {
        try {
            const cust = await medusaServer.customers.retrieve();
            return cust.customer;
        } catch (error) {
            console.log(">>> Error: " + error);
            
            return null;
        }
    }
    return null;
}