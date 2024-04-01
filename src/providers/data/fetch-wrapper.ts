import { GraphQLFormattedError } from "graphql";

type Error = {
	message: string;
	statusCode: string;
};

const customFetch = async (url: string, oprions: RequestInit) => {
	const accessToken = localStorage.getItem("access_token");

	const headers = oprions.headers as Record<string, string>;

	return await fetch(url, {
		...oprions,
		headers: {
			...headers,
			Authorization: headers?.Authorization || `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			"Appolo-Require-Preflight": "true",
		},
	});
};

const getGraphQLErrors = (
	body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
	if (!body) {
		return {
			message: "Uknown error",
			statusCode: "INTERNAL_SERVER_ERROR",
		};
	}

	if ("errors" in body) {
		const errors = body?.errors;

		const messages = errors?.map(error => error?.message)?.join("");
		const code = errors?.[0]?.extensions?.code;

		return {
			message: messages || JSON.stringify(errors),
			statusCode: code || 500,
		};
	}
	return null;
};

const fetchWrapper = async (url: string, oprions: RequestInit)=>{
    
}
