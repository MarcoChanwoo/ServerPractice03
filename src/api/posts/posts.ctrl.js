import Post from '../../modules/post';

/*  데이터 생성
    POST /api/posts
    {
        title: 제목
        body: 내용,
        tags: [태그1, 태그2]
    }
*/
export const write = async (ctx) => {
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
*/
export const update = async (ctx) => {
    const { id } = ctx.params;
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

// let postId = 1; // id의 초기값

// // posts 배열 초기 데이터
// const posts = [
//     {
//         id: 1,
//         title: '제목',
//         body: '내용',
//     },
// ];

// /*  포스트 작성
//     POST /api/posts
//     {title, body}
// */
// export const write = (ctx) => {
//     // REST API의 Request Body는 ctx.request.body에서 조회할 수 있음
//     const { title, body } = ctx.request.body;
//     postId += 1;
//     const post = { id: postId, title, body };
//     posts.push(post);
//     ctx.body = post;
// };

// /*  포스트 목록 조회
//     GET /api/posts
// */
// export const list = (ctx) => {
//     ctx.body = posts;
// };

// /*  특정 포스트 조회
//     GET /api/posts/:id
// */
// export const read = (ctx) => {
//     const { id } = ctx.params;
//     // 주어진 id값으로 포스트를 찾음
//     // 파라미터로 받아 온 값은 문자열 형식이므로 파라미터를 숫자로 변환하거나
//     // 비교할 p.id 값을 문자열로 변환해야 함
//     const post = posts.find((p) => p.id.toString() === id);
//     // 포스트가 없으면 오류를 반환함
//     if (!post) {
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     ctx.body = post;
// };

// /*  특정 포스트 제거
//     DELETE /api/posts/:id
// */
// export const remove = (ctx) => {
//     const { id } = ctx.params;
//     // 해당 id를 가진 post가 몇 번째인지 확인함
//     const index = posts.findIndex((p) => p.id.toString() === id);
//     // 포스트가 없으면 오류를 반환
//     if (index === -1) {
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     posts.splice(index, 1);
//     ctx.status = 204; // Conflict
// };

// /*  포스트 수정(교체)
//     PUT /api/posts/:id
//     {title, body}
// */
// export const replace = (ctx) => {
//     // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용함
//     const { id } = ctx.params;
//     // 해당 id를 가진 post가 몇 번째인지 확인함
//     const index = posts.findIndex((p) => p.id.toString() === id);
//     // 포스트가 없으면 오류를 반환
//     if (index === -1) {
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     // 전체 객체를 덮어 씌움
//     // => id를 제외한 기존 정보를 날리고, 객체를 새로 만듦
//     posts[index] = {
//         id,
//         ...ctx.request.body,
//     };
//     ctx.body = posts[index];
// };

// /*  포스트 수정(특정 필드 변경)
//     PATCH /api/posts/:id
//     {title, body}
// */
// export const update = (ctx) => {
//     // PATCH 메서드는 주어진 필드만 교체함
//     const { id } = ctx.params;
//     // 해당 id를 가진 post가 몇 번째인지 확인함
//     const index = posts.findIndex((p) => p.id.toString() === id);
//     // 포스트가 없으면 오류를 반환
//     if (index === -1) {
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     // 기존 값에 정보를 덮어 씌움
//     posts[index] = {
//         ...posts[index],
//         ...ctx.request.body,
//     };
//     ctx.body = posts[index];
// };
