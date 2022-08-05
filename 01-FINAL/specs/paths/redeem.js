module.exports = [{
    url: "/create",
    post: {
        summary: "create",
        description: "create",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "model of  redeem",
                required: true,
                schema: {
                    $ref: "#/definitions/redeem"
                }
            }],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},


];