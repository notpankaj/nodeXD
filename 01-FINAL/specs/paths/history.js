module.exports = [
    {
        url: "/make",
        post: {
            summary: "create history",
            description: "create history",
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
                    description: "model of  history create",
                    required: true,
                    schema: {
                        $ref: "#/definitions/historyCreate"
                    }
                },
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
        url: "/update/{id}",
        put: {
            summary: "update history ",
            description: "update history ",
            parameters: [{
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "path",
                name: "id",
                description: "history id",
                required: true,
                type: "string"
            },

            {
                in: "body",
                name: "body",
                description: "Model of historyUpdate ",
                required: true,
                schema: {
                    $ref: "#/definitions/historyUpdate"
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
        url: "/getByUserId/{id}",
        get: {
            summary: "history list ",
            description: "history list by user id ",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                {
                    in: "path",
                    type: "string",
                    name: "id",
                    description: "user id",
                    required: true
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