module.exports = [{
    url: "/join",
    post: {
        summary: "join ",
        description: "join club",
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
                description: "join club model",
                required: true,
                schema: {
                    $ref: "#/definitions/joinOrLeave"
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
    url: "/leave",
    post: {
        summary: "leave club",
        description: "leave club ",
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
                description: "leave club model",
                required: true,
                schema: {
                    $ref: "#/definitions/joinOrLeave"
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
    },
},
{
    url: "/membersByClubName/{name}",
    get: {
        summary: "member list  by club name",
        description: "member list  by club name",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "query",
                type: "string",
                name: "country",
                description: "country",
                required: true
            },
            {
                in: "query",
                type: "string",
                name: "name",
                description: "club name",
                required: false
            },
            // {
            //     in: "body",
            //     name: "body",
            //     description: "leave club model",
            //     required: true,
            //     schema: {
            //         $ref: "#/definitions/joinOrLeave"
            //     }
            // }

        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    },
},
{
    url: "/membersByFilter",
    get: {
        summary: "member list  according to filter",
        description: "member list  according to filter",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "query",
                type: "string",
                name: "popular",
                description: "set it true if you want popular member",
                required: false
            },
            {
                in: "query",
                type: "string",
                name: "country",
                description: "country",
                required: true
            },
            {
                in: "nearByMe",
                type: "string",
                name: "lat,long",
                description: "enter lat long comma separator like(1321313,2131331) ",
                required: false
            },

            // {
            //     in: "body",
            //     name: "body",
            //     description: "leave club model",
            //     required: true,
            //     schema: {
            //         $ref: "#/definitions/joinOrLeave"
            //     }
            // }

        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    },
},
]