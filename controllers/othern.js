// othern.js
const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");



const othern = {
    // ...
    showForm(req, res) {
        res.render('othern');  // Entfernen Sie das vorangestellte "/"
    },
    async handleSubmission(req, res) {
        const text = req.body.text;
        console.log(text);

        // Speichern des Texts in der Datenbank
        await otherStore.addOther({user_id:req.session.user_id, text:text});

        // Nach dem Verarbeiten der Daten wird der Benutzer zurück zur Startseite geleitet
        res.redirect('/profile');
    }
};

module.exports = othern;

