export const en_translations = {
    "button": {
        "device": "🕶 Device",
        "game": "Application 📱",
        "games": "Applications 📱",
        "returnStart": "🏠 Return to Start 🏠",
        "return": "⬅️ Return"
    },
    "start": {
        "text": "👋🏻 Hello {{userName}}.\n\nWelcome to Meta's referral bot, a <strong>completely random</strong> and fair referral manager for applications and devices.\n\n💎 Select Information if you want to learn more about Meta's referral program.\n\n⚠️ <i>This bot has no affiliation with the Meta company and has been created by DrXoo and Truenox for the enjoyment of the community.</i>\n\n🚨 <i>Want to talk about VR or any other technology-related topic? Join the best tech community (spanish speaking):</i>\n <a href='https://t.me/truenoxtech'>TruenoxTech</a>",
        "button": {
            "profile": "📈 My Referrals 📈",
            "give": "📤 Give",
            "request": "Request 📥",
            "info": "💬 Information 💬",
            "instructions": "📄 Instructions 📄",
            "support": "🔧 Support 🔧"
        }
    },
    "info": {
        "text": "💎 Meta's referral program is a program of recommendations among friends for recommending the purchase of their devices or applications. They provide respective discounts or store credit.\n\n🔹 For devices, currently, €30/30$ is granted to both the referring and referred person.\n\n🔸 For applications, currently, a 25% discount is granted to the referred person, and €5/5$ to the referrer.\n\n⚠️ These conditions are subject to change and only valid in available countries where Meta provides service. For more information, click on the more information button.",
        "button": {
            "availableCountries": "🌐 Available Countries 🌐",
            "deviceRecomendations": "🕶 Device Conditions 🕶",
            "appRecomendations": "📱 Application Conditions 📱",
        }
    },
    "request": {
        "text": "📥 You have selected to request referrals.\n\nThis section is intended for you to request referrals for both devices and any applications you desire.\n\nPlease select whether you want to receive a device referral or a referral for an application.",
        "games": {
            "requestGameReferral": "⬇️ Enter the application name ⬇️",
            "foundRequestGames": "❇️ I have found some applications with that name, choose yours",
            "notFoundRequestGames": "❌ I found nothing with that name.\n\n⚠️ This search engine is simple, type the beginning of the name.",
            "gameReferral": "✅ Here is the referral for the application you selected.\n<i>Randomly obtained from {{numUsers}} users</i>\n\n{{url}}",
        },
        "device": {
            "deviceReferral": "✅ Here is your referral. ✅\n<i>Randomly obtained from {{numUsers}} users</i>\n\n{{url}}",
            "noUsers": "⚠️ I couldn't find any users."
        }
    },
    "give": {
        "text": "📤 You have selected to give referrals.\n\nThis section is intended for you to register your links in order to give them to future individuals who request referrals for the applications or device you provide.\n\nPlease select whether you want to give a device referral or referrals for applications.",
        "games": {
            "text": "⬇️ Paste up to 20 links of your Meta applications ⬇️",
            "added": "❇️ {{games}} applications detected. ❇️\n\n⚠️ The process of adding each application takes a while and is an indirect process.\n\nYou can use the bot normally",
            "noFoundGames": "⚠️ No applications were detected in the links",
            "tooManyUrls": "❌ You have entered more than 20 links"
        },
        "device": {
            "text": "⬇️ Paste your Meta referral link directly from your official app ⬇️",
            "added": "✅ Device referral of user {{userName}} has been added.",
            "alreadyAdded": "⚠️ User already added.",
            "wrongFormat": "❌ Incorrect format.",
        },
    },
    "instructions": {
        "text": "⚠️ INSTRUCTIONS ⚠️\n\n❇️ GENERAL CONDITIONS\n\n1️⃣ Always comply with Meta\'s referral program conditions and supported countries. For more information, press the Information button on the main menu.\n\n2️⃣ The referral acceptance must be done before activating the glasses. If you have already activated the glasses before accepting the referral and it has not been more than a week, please contact Meta support.\n\n3️⃣ Both the referred person and the referrer must be from the same country. If you are from different countries, using a VPN might work, but we do not guarantee its functionality.\n\n😎 DEVICE\n\n1️⃣ Firstly, request a referral in Request > Device and obtain the corresponding referral link.\n\n2️⃣ After obtaining the referral link, click on it, and it will take you to the browser. You must create a Meta account if you don't have one or log in if you already have one, and accept the recommendation. The process will end with a message on the screen saying that you have accepted the purchase recommendation and can proceed to purchase a device.\n\n3️⃣ Once the recommendation is accepted and having the device at home, proceed to turn on the glasses and activate them. You must log in with the same account that accepted the recommendation.\n\n4️⃣ After reaching the main menu of the glasses (which initially shows a menu bar with the profile, time, and various applications), you will receive a notification that you now have €30 available in your account. If not, you must contact Meta support providing both the referred person and the referrer: Full name, email associated with the account, and Nick registered, sometimes they also request the serial number of the device or a screenshot of where the referral link was provided. (in case of chat).\n\n📱APPLICATIONS\n\n1️⃣ Firstly, request a referral in Request > Application and obtain the corresponding referral link.\n\n2️⃣ The bot will ask you for the application name; it must be written correctly, or else the search will not be correct.\n\n3️⃣ Once the application or corresponding application is selected, we proceed to accept the referral; it usually entails a 25% discount. If it is less, it means the person does not accept more credit. If the amount is not 25%, preferably do not accept and request another referral.\n\n4️⃣ After accepting the application recommendation that interests us, we proceed to make our purchase; in the payment section of the application, a corresponding 25% discount will appear, if not, it means you have not accepted the referral correctly."
    },
    "profile": {
        "text": 'This is a summary of your added referrals.\n\n <i>Remember that there will be pending applications to add.</i>\n\n🕶 Device\n\n<strong>{{userName}}</strong>\n\n📱Added Applications:\n\n{{- games}}'
    }
}