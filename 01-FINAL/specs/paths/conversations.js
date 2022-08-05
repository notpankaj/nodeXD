module.exports = [{
    url: '/getOldConversations',
    get: {
        summary: 'get old chat',
        description: 'get old chat',
        parameters: [{
            in: 'query',
            type: "string",
            name: 'conversationId',
            description: 'conversationId',
            required: true,
        }, {
            in: 'query',
            type: "integer",
            name: 'pageNo',
            description: 'pageNo',
            required: true,
        }, {
            in: 'query',
            type: "integer",
            name: 'pageSize',
            description: 'pageSize',
            required: true,
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/Error'
                }
            }
        }
    },

},
{
    url: "/conversationList/{id}",
    get: {
        summary: "conversationList",
        description: "conversationList",
        parameters: [
            //     {
            //     in: "header",
            //     name: "x-access-token",
            //     description: "token to access api",
            //     required: true,
            //     type: "string"
            // },
            {
                in: "path",
                type: "string",
                name: "id",
                description: "user id",
                required: true
            },
            // {
            //     in: "body",
            //     name: "body",
            //     description: "Model of update post",
            //     required: true,
            //     schema: {
            //         $ref: "#/definitions/postCreate"
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
    }
},


]
