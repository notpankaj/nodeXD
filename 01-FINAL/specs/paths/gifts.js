module.exports = [
    {
        url: "/add",
        post: {
            summary: "add gift",
            description: "add gift",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: false,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of gift                                                                                  ",
                    required: true,
                    schema: {
                        $ref: "#/definitions/giftCreate"
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
        url: "/send",
        post: {
            summary: "send gift",
            description: "send gift",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: false,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of send gift                                                                                  ",
                    required: true,
                    schema: {
                        $ref: "#/definitions/sendGift"
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
        url: "/list",
        get: {
            summary: "gift list",
            description: "gift list ",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
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
            summary: "update",
            description: "update by id ",
            parameters: [{
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
                description: "gift id",
                required: true
            },
            {
                in: "body",
                name: "body",
                description: "Model of gift update",
                required: true,
                schema: {
                    $ref: "#/definitions/giftUpdate"
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
        url: "/uploadIcon/{id}",
        put: {
            summary: "uploadIcon ",
            description: "uploadIcon ",
            parameters: [{
                in: "formData",
                name: "image",
                type: "file",
                description: "The file to upload.",
                required: true,
            },
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
                description: "gift id",
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
    {
        url: "/myGifts/{id}",
        get: {
            summary: "myGifts",
            description: "my Gifts user by id ",
            parameters: [{
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
        url: "/buy",
        post: {
            summary: "buy gift",
            description: "buy gift",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: false,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of buyGift",
                    required: false,
                    schema: {
                        $ref: "#/definitions/buyGift"
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