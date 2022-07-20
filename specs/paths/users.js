module.exports = [
{
    url: "/login",
    post: {
        summary: "login",
        description: "login",
        parameters: [
            {
                in: "body",
                name: "body",
                description: "Model of user login",
                required: true,
                schema: {
                    $ref: "#/definitions/login"
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
{
    url: "/create",
    post: {
        summary: "create",
        description: "create a users",
        parameters: [
            {
                in: "body",
                name: "body",
                description: "Model of user create",
                required: true,
                schema: {
                    $ref: "#/definitions/userCreate"
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
{
    url: "/profile/{id}",
    get: {
        summary: "get user",
        description: "get user  detail ",
        parameters: [
            {
                in: "path",
                type: "string",
                name: "id",
                description: "user id",
                required: true
            },],
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
        summary: "update user",
        description: "update user  detail ",
        parameters: [
            {
                in: "path",
                type: "string",
                name: "id",
                description: "user id",
                required: true
            },
            {
                in: "header",
                type: "string",
                name: "x-access-token",
                description: "your auth token",
                required: true
            },
            {
                in: "body",
                name: "body",
                description: "Model of user update",
                required: true,
                schema: {
                    $ref: "#/definitions/userUpdate"
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
    url: "/delete/{id}",
    delete: {
        summary: "delete user",
        description: "delete user detail ",
        parameters: [
            {
                in: "path",
                type: "string",
                name: "id",
                description: "user id",
                required: true
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
    url: "/delete/{id}",
    delete: {
        summary: "delete user",
        description: "delete user detail ",
        parameters: [
            {
                in: "path",
                type: "string",
                name: "id",
                description: "user id",
                required: true,
                schema: {
                    $ref: "#/definitions/userDelete"
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
];