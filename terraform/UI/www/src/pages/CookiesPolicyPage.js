import MarkdownPage from './MarkdownPage.js'

var markdown = `
# Cookies Policy for Website

[Jassoft Ltd](https://jassoft.co.uk) (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) uses cookies on [DashVid.io](https://DashVid.io) (the &quot;Service&quot;). By using the Service, you consent to the use of cookies.

Our Cookies Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Service, your choices regarding cookies and further information about cookies.

### **What are cookies**

Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.

Cookies can be &quot;persistent&quot; or &quot;session&quot; cookies.

### **How** **DashVid.io**  **uses cookies**

When you use and access the Service, we may place a number of cookies files in your web browser.

We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, to enable advertisements delivery, including behavioral advertising.

We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:

- Essential cookies. We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.

### **Third-party cookies**

In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.

### **What are your choices regarding cookies**

If you&#39;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.

Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.

### **Where can your find more information about cookies**

You can learn more about cookies and the following third-party websites:

- [AllAboutCookies](http://www.allaboutcookies.org/)
- [Network Advertising Initiative](http://www.networkadvertising.org/)
`;

export default class CookiesPolicyPage extends MarkdownPage {

    constructor(props) {
        super(props, markdown);

    }
}