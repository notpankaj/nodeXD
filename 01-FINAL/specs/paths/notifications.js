module.exports = [
    {
        url: "/sendCallNotification",
        post: {
            summary: "send Call Notification",
            description: "send Call Notification ",
            parameters: [{
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "Model of sendCallNotification",
                required: true,
                schema: {
                    $ref: "#/definitions/sendCallNotification"
                }
            }
            ],
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
    {
        url: "/random",
        post: {
            summary: "random Call ",
            description: "random Call  ",
            parameters: [{
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "Model of randomCall",
                required: true,
                schema: {
                    $ref: "#/definitions/randomCall"
                }
            }
            ],
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