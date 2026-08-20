(() => {
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const articles = {
    offline: {
      eyebrow: 'Offline software',
      title: 'Maximum speed. No internet dependency.',
      intro: 'Offline software runs directly on your business computer or local network. Daily work stays fast and dependable because every click does not need to travel over the internet.',
      benefits: [
        ['Fast response', 'Billing, searching and saving happen locally, so the system responds immediately during busy hours.'],
        ['Always available', 'Your team can continue working through an internet outage or unstable connection.'],
        ['Simple operation', 'Ideal for a single shop, office or location that does not need live remote access.']
      ],
      tradeoff: 'Information stays on the local device or business network. Remote access, multi-location visibility and off-site backup require an additional cloud or synchronization option.',
      bestFor: 'POS counters, stores, warehouses and internal tools where uninterrupted local operation and speed matter most.',
      faqs: [
        ['Will it become slow without internet?', 'No. The software works locally, so internet speed does not affect normal operation.'],
        ['Can I back up my data?', 'Yes. We can configure scheduled local backups or recommend Offline + Cloud for secure off-site copies.'],
        ['Can several computers use it?', 'Yes, devices on the same local network can share the system when the solution is designed for multiple users.']
      ]
    },
    'offline-cloud': {
      eyebrow: 'Offline + Cloud',
      title: 'Work offline. Synchronize with the cloud.',
      intro: 'This is Zybility’s smarter hybrid approach. All day-to-day work happens locally at full speed, just like offline software. Important data then synchronizes securely with the cloud in the background.',
      benefits: [
        ['Smooth and fast', 'Sales and operational work do not wait for a server response, helping the system stay responsive without frustrating lag.'],
        ['Keeps working', 'If the internet goes down, your team continues normally. Synchronization resumes automatically when the connection returns.'],
        ['Local reliability, cloud protection', 'The business keeps a fast local system while its important information is also available for cloud backup, reporting and approved remote access.']
      ],
      tradeoff: 'Synchronization rules must be designed carefully, especially when several locations edit the same information. Zybility handles retrying, conflict rules and connection recovery as part of the solution.',
      bestFor: 'Retail, restaurants, distributed teams and growing businesses that cannot stop during an outage but still need cloud visibility and protection.',
      faqs: [
        ['Will I lose work when the internet fails?', 'No. New work is stored locally and queued safely. It synchronizes after the connection returns.'],
        ['Will synchronization slow down the system?', 'No. It runs in the background and is designed not to interrupt normal business tasks.'],
        ['Is this better than cloud-only software?', 'For businesses that need guaranteed operation during unstable connectivity, it offers the strongest balance of speed, continuity and remote access.']
      ]
    },
    cloud: {
      eyebrow: 'Cloud software',
      title: 'Your business, available wherever you work.',
      intro: 'Cloud software runs securely online and is ideal for administration, management dashboards, web applications and information that needs to be shared across locations.',
      benefits: [
        ['Use multiple devices', 'Open the system from supported desktops, laptops, tablets and mobile phones without installing a separate database on every device.'],
        ['One centralized view', 'Managers and authorized teams see current information from different locations in one controlled system.'],
        ['Easy to grow', 'Add users, locations and new web-based workflows as the business expands.']
      ],
      tradeoff: 'Normal access depends on a reliable internet connection. For checkout counters or operations that must never stop, Offline + Cloud may be a better choice.',
      bestFor: 'Admin portals, manager dashboards, customer web applications, multi-location reporting and teams that work from different devices.',
      faqs: [
        ['Is cloud software only for computers?', 'No. Responsive cloud applications can work across desktop, tablet and mobile browsers.'],
        ['Is my information visible to everyone?', 'No. Authentication and role-based permissions control exactly what each approved user can access.'],
        ['Will it be fast?', 'Yes, when paired with suitable hosting and a stable connection. We optimize the application, data requests and interface for quick everyday use.']
      ]
    }
  };

  const article = articles[slug] || articles['offline-cloud'];
  document.querySelector('[data-deployment]').innerHTML = `
    <section class="page-hero deployment-hero"><div class="container"><span class="eyebrow">${article.eyebrow}</span><h1>${article.title}</h1><p class="lead">${article.intro}</p><a class="btn btn-primary" href="/contact/">Discuss My System <span class="arrow">→</span></a></div></section>
    <article class="section deployment-article"><div class="container"><div class="section-head"><div><span class="eyebrow">Why choose it?</span><h2>Designed around real business conditions.</h2></div><p>A practical deployment model should match how your team works, where they work and what must happen when connectivity changes.</p></div><div class="grid deployment-benefits">${article.benefits.map(([title,text],index)=>`<section class="card"><div class="card-mark">0${index+1}</div><h3>${title}</h3><p>${text}</p></section>`).join('')}</div><div class="deployment-notes"><section class="card"><span class="eyebrow">Best suited for</span><h2>${article.bestFor}</h2></section><section class="card deployment-tradeoff"><span class="eyebrow">Good to know</span><h3>The practical consideration</h3><p>${article.tradeoff}</p></section></div><div class="deployment-faq"><span class="eyebrow">Common questions</span><h2>Clear answers before you choose.</h2><div class="faq-list">${article.faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></div></article>
    <section class="final-cta"><div class="container"><span class="eyebrow">Choose with confidence</span><h2>Not sure which model fits?</h2><p class="lead">Tell us about your locations, devices and internet reliability. We will recommend the simplest dependable approach.</p><a class="btn btn-primary" href="/contact/">Talk to Zybility <span class="arrow">→</span></a></div></section>`;
})();
