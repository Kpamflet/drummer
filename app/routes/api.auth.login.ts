import { ActionFunctionArgs, json } from "@remix-run/node";
import medusaServer from "~/services/medusa.server";
import { commitSession, getSession } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const data = await request.json();
    const auth = await medusaServer.auth.authenticate({ email: data.email, password: data.password });
    const session = await getSession(request.headers.get("Cookie"));
    session.set("cid", auth.customer.id);
    return json({ success: true }, {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}