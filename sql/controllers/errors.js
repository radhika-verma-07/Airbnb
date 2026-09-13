exports.pageNotFound = (req, res, next) => {
    res.status(404).render("404", {
        currentPage: "",
        pageTitle: "404 Page Not Found"
    });
};
