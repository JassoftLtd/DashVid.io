import MarkdownPage from './MarkdownPage.js'

var markdown = `
# Acceptable Use Policy for Website

### **1.Introduction**

This is our acceptable use policy. If you use our website, it means that the policy applies to you and that you agree with it as part of our Website Terms [DashVid.io](https://DashVid.io).

We may change these terms, so we expect you to check this page from time to time as the changes will be binding on you. There may also be changes elsewhere on our site.

### **2.Who We Are**

[DashVid.io](https://DashVid.io) is operated by [Jassoft Ltd](https://Jassoft.co.uk), a UK Limited company registered in England under company number 07419231.

Some important details about us:

Our registered office is at: 51 Watleys End Road, Bristol, BS36 1PH

Our VAT number is: 174 7208 96

### **3.What you must not do**

You must not use the site to do any of the following:

### **4.Content Standards**

Here are our content standards. They apply to all material that you contribute to our site and to all interactive services.

You must follow these standards carefully, but please also follow the spirit of them.

Your contributions must be:

Your contributions must not be:

And they must not:

### **5.Interactive Services**

Our standards for interactive services, such as chat rooms and bulletin boards, are as follows:

Please note, however, that we are not required to moderate our interactive service. We will not be responsible for any loss to anyone who does not use our site according to our standards (whether or not we have moderated the service).

### **6.Disclosure to Courts**

If you have to disclose Confidential Information by order of a court or other public body you may do so.

### **7.Suspension and Termination**

If we think you have breached this policy, we will take whatever steps we think are necessary.

These might include:

We exclude legal responsibility and cost for actions we take to deal with your breach of our policy.
`;

export default class AcceptableUsePolicyPage extends MarkdownPage {

    constructor(props) {
        super(props, markdown);

    }
}