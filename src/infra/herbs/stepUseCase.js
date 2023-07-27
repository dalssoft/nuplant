const { step, Err } = require('@herbsjs/herbs')

function stepUseCase({ usecase, user, request, response, injection }) {
    return step(async ctx => {
        const uc = usecase(ctx)(injection)
        const hasAccess = await uc.authorize(user(ctx))
        if (hasAccess === false) {
            return Err.permissionDenied({
                message: `User is not authorized to ${uc.description}`,
            })
        }
        const ret = await uc.run(request(ctx))
        if (ret.isErr) return ret
        return response(ctx, ret.ok)
    })
}

module.exports = { stepUseCase }