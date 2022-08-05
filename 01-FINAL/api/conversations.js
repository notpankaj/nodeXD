'use strict'
const service = require('../services/conversations')
const response = require('../exchange/response')
const conversationListMapper = require('../mappers/conversations')
const messagesMapper = require('../mappers/messages')

const getOldChat = async (req, res) => {
    const log = req.context.logger.start(`api:conversations:getOldChat:${req.query.conversationId}`)
    try {
        const oldChat = await service.getOldChat(req.query, req.context)
        log.end()
        return response.page(res, messagesMapper.toSearchModel(oldChat), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, oldChat.count)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(err, err.message)
    }
}

const getConversationList = async (req, res) => {

    const log = req.context.logger.start(`api:conversations:getConversationList:${req.params.id}`)
    try {
        const recentConnectedUser = await service.conversationList(req.params.id, req.context)
        log.end()
        // return response.page(res, oldChat, Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, oldChat.count)
        return response.data(res, conversationListMapper.toSearchModel(recentConnectedUser))
        // return response.data(res, recentConnectedUser)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(err, err.message)
    }

}

exports.getOldChat = getOldChat
exports.getConversationList = getConversationList
