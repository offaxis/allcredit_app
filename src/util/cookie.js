import cookie from 'cookie';
import setCookie from 'set-cookie';
import moment from 'moment';

export default {
    setItem(name, value, options = {}) {
        // setCookie('myCookie', 'the value of the cookie', {
        //     domain: '.example.org'
        // });
        if (!options.expires) {
            options.expires = moment()
                .add(2, 'months')
                .format();
        }
        setCookie(name, value, options);
    },

    getItem(name) {},
};
