const auth = {
    /*
     * Some routes require an authenticated user.
     * Use this function as protection.
     */
    protected(request, response, next) {
        if (request.session.user_id) {
            next();
        } else {
            response.redirect('/login');
        }
    },
}

module.exports = auth;