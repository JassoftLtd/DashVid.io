import MarkdownPage from './MarkdownPage.js'

var markdown = `
# Privacy Policy for Website

### **1.Introduction**

This is our privacy policy. It tells you how we collect and process data received from you on our site.

If you have any comments on this privacy policy, please email them to website@dashvid.io.

### **2.Who We Are**

Here are the details that the Data Protection Act 1998 says we have to give you as a &#39;data controller&#39;:

Our site address is [https://Dashvid.io](https://Dashvid.io)

Our company name is [Jassoft Ltd](https://Jassoft.co.uk)

Our registered address is 51 Watleys End Road, Bristol, BS36 1PH

Our nominated representative is Jonathan Shaw

### **3.What we may collect**

We may collect and process the following data about you:

Information about your device or web browser.

### **4.Cookies**

We use cookies to distinguish users and improve our site. Please look at our Cookies Policy [https://DashVid.io/cookies-policy](https://DashVid.io/cookies-policy) for more cookie information.

### **5.How we use what we collect**

We use information about you to:

If you are already our customer, we will only contact you electronically about things similar to what was previously sold to you.

If you are a new customer, you will only be contacted if you agree to it.

If you don&#39;t want to be contacted for marketing purposes, please tick the relevant box that you will find on screen.

Please note: We don&#39;t identify individuals to our advertisers, but we do give them aggregate information to help them reach their target audience, and we may use information we have collected to display advertisements to that audience.

### **6.Where we store your data**

We may transfer your collected data to storage outside the European Economic Area (EEA). It may be processed outside the EEA to fulfil your order and deal with payment.

By giving us your personal data, you agree to this arrangement. We will do what we reasonably can to keep your data secure.

Payment will be encrypted. If we give you a password, you must keep it confidential. Please don&#39;t share it. Although we try to provide protection, we cannot guarantee complete security for your data, and you take the risk that any sending of that data turns out to be not secure despite our efforts.

### **7.Disclosing your information**

We are allowed to disclose your information in the following cases:

### **8.Your rights**

You can ask us not to use your data for marketing. You can do this by ticking the relevant boxes on our forms, or by contacting us at any time at website@dashvid.io.

The Data Protection Act 1998 gives you the right to see information we hold about you. We can charge you a fee (currently £10) for this service.

### **9.Links to other sites**

Please note that our terms and conditions and our policies will not apply to other websites that you get to via a link from our site.

### **10.Changes**

If we change our Privacy Policy, we will post the changes on this page. If we decide to, we may also email you.

### **11.Dispute Resolution**

11.1 The Parties will use their best efforts to negotiate in good faith and settle any dispute that may arise out of or relate to this Agreement or any breach of it.

11.2 If any such dispute cannot be settled amicably through ordinary negotiations between the Parties, or either or both is or are unwilling to engage in this process, either Party may propose to the other in writing that structured negotiations be entered into with the assistance of a fully accredited mediator before resorting to litigation.

11.3 If the Parties are unable to agree upon a mediator, or if the mediator agreed upon is unable or unwilling to act and an alternative mediator cannot be agreed, any party may within 14 days of the date of knowledge of either event apply to LawBite to appoint a mediator under the LawBite Mediation Procedure.

11.4 Within 14 days of the appointment of the mediator (either by mutual agreement of the Parties or by LawBite in accordance with their mediation procedure), the Parties will meet with the mediator to agree the procedure to be adopted for the mediation, unless otherwise agreed between the parties and the mediator.

11.5 All negotiations connected with the relevant dispute(s) will be conducted in confidence and without prejudice to the rights of the Parties in any further proceedings.

11.6 If the Parties agree on a resolution of the dispute at mediation, the agreement shall be reduced to writing and, once signed by the duly authorised representatives of both Parties, shall be final and binding on them.

11.7 If the Parties fail to resolve the dispute(s) within 60 days (or such longer term as may be agreed between the Parties) of the mediator being appointed, or if either Party withdraws from the mediation procedure, then either Party may exercise any right to seek a remedy through arbitration by an arbitrator to be appointed by LawBite under the Rules of the LawBite Arbitration Scheme.

11.8 Any dispute shall not affect the Parties&#39; ongoing obligations under the Agreement.
`;

export default class PrivacyPolicyPage extends MarkdownPage {

    constructor(props) {
        super(props, markdown);

    }
}