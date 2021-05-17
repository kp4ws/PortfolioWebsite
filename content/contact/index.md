---
title: "Get In Touch"
date: 2021-05-10T10:22:45-06:00
draft: true
---

<form action="/thankyou" method="POST" name="contact" >
<p style="visibility: hidden">
    <label for="bot">Don't fill this out</label><input name="bot-field">
</p>

<label for="fName">First Name</label>
<input type="text" name="fName" placeholder="Enter Firstname...">

<label for="lName">Last Name</label>
<input type="text" name="lName" placeholder="Enter Lastname...">

<!--
data-netlify="true" netlify-honeypot="bot-field" netlify
<div data-netlify-recaptcha></div>
-->

<input type="submit" value="Submit">

    
    
</form>