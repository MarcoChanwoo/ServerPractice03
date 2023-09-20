import Post from '../../modules/post';
import mongoose from 'mongoose';
import Joi from '../../../node_modules/joi/lib/index';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; // Bas Request
        return;
    }
    return next();
};

/*  데이터 생성
    POST /api/posts
    {
        title: 제목
        body: 내용,
        tags: [태그1, 태그2]
    }
*/
export const write = async (ctx) => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 보유함을 검증
        title: Joi.string().required(), // required()가 있다면 필수항목
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), // 문자열 배열
    });
    // 검증 후 실패인 경우 에러처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }
    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*  데이터 조회
    GET /api/posts
*/
export const list = async (ctx) => {
    try {
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*  특정 포스트 조회
    GET /api/posts/:id
*/
export const read = async (ctx) => {
    const { id } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if (!post) {
            ctx.status = 404; // Not Found
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*  데이터 삭제
    DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content(성공했으나 응답할 데이터는 없음)
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*  데이터 수정
    PATCH /api/posts/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['태그1', '태그2']
    }
*/
export const update = async (ctx) => {
    const { id } = ctx.params;
    // write에서 사용한 schema와 비슷하나, required()가 없음
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });
    // 검증 실패인 경우 에러처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true,
            // true: 업데이트된 데이터를 반환
            // false: 업데이트되기 전 데이터를 반환
        }).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
