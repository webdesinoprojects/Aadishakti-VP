import {
  DEFAULT_CAREERS_PAGE,
  DEFAULT_HOME_PAGE,
  DEFAULT_BUSINESSES_PAGE,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_PAGE_HERO_IMAGES,
  DEFAULT_GALLERY_PAGE,
  DEFAULT_INVESTORS_PAGE,
  DEFAULT_MEDIA_PAGE,
  DEFAULT_SITE_NAVIGATION,
  DEFAULT_SOURCING_PAGE,
  DEFAULT_SUSTAINABILITY_PAGE,
} from '../../../data/publicCmsDefaults';

const text = (key, label, type = 'text') => ({ key, label, type });
const list = (key, label, fields) => ({ key, label, type: 'list', fields });

export const PUBLIC_PAGE_DEFINITIONS = {
  home: {
    title: 'Home Page Sections',
    description: 'Manage every homepage section below the carousel. Hero slides remain in Home / Hero.',
    singletonKey: 'homePage', publicRoute: '/', defaults: DEFAULT_HOME_PAGE,
    sections: [
      { title: 'Hero actions and facts', fields: [text('heroPrimaryButton', 'Primary button'), text('heroSecondaryButton', 'Secondary button'), list('heroFacts', 'Hero fact cards', [text('label', 'Label'), text('value', 'Value')]), list('heroStats', 'Hero statistics', [text('value', 'Value'), text('suffix', 'Suffix'), text('label', 'Label')])] },
      { title: 'Trusted clients', fields: [text('clientsLabel', 'Section label'), list('clients', 'Client logos', [text('name', 'Client name'), text('image', 'Logo', 'image'), text('height', 'Display height, e.g. 45px')])] },
      { title: 'Company overview', fields: [text('overviewLabel', 'Section label'), text('overviewHeading', 'Heading'), text('overviewLead', 'Lead paragraph', 'textarea'), text('overviewBody', 'Body paragraph', 'textarea'), text('overviewFootnote', 'Final paragraph', 'textarea'), list('overviewStats', 'Overview statistics', [text('value', 'Value'), text('label', 'Label')]), list('overviewImages', 'Overview images', [text('image', 'Image', 'image'), text('alt', 'Alternative text')])] },
      { title: 'Business entity cards', fields: [list('entities', 'Entity cards', [text('code', 'Code'), text('subtitle', 'Subtitle'), text('description', 'Description', 'textarea'), text('image', 'Background', 'image'), text('tags', 'Tags', 'lines'), text('link', 'Destination'), text('button', 'Button label')])] },
      { title: 'Core strengths', fields: [text('strengthsLabel', 'Section label'), text('strengthsHeading', 'Heading'), text('strengthsButton', 'Button label'), list('strengths', 'Strengths', [text('title', 'Title'), text('description', 'Description', 'textarea')])] },
      { title: 'Product showcase', fields: [text('productsLabel', 'Section label'), text('productsHeading', 'Heading'), text('productsButton', 'Button label'), text('productApplicationsLabel', 'Applications label')] },
      { title: 'Statistics strip', fields: [list('stats', 'Statistics', [text('value', 'Value'), text('suffix', 'Suffix'), text('label', 'Label')])] },
      { title: 'Sustainability feature', fields: [text('sustainabilityLabel', 'Section label'), text('sustainabilityHeading', 'Heading'), text('sustainabilityQuote', 'Quote', 'textarea'), text('sustainabilityButton', 'Button label'), text('sustainabilityImage', 'Background image', 'image'), list('sustainabilityStats', 'Sustainability statistics', [text('value', 'Value'), text('label', 'Label')])] },
      { title: 'Investor preview', fields: [text('investorsLabel', 'Section label'), text('investorsHeading', 'Heading'), text('investorsTopButton', 'Top button'), text('investorsBottomButton', 'Bottom button'), list('investorCards', 'Investor cards', [text('label', 'Label'), text('value', 'Value'), text('description', 'Description', 'textarea')])] },
    ],
  },
  businesses: {
    title: 'Businesses',
    description: 'Manage every group division, its imagery, details, badges, contact lines, and metrics.',
    singletonKey: 'businessesPage', publicRoute: '/businesses', defaults: DEFAULT_BUSINESSES_PAGE,
    sections: [
      { title: 'Page hero', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image')] },
      { title: 'Business divisions', fields: [list('divisions', 'Divisions', [text('id', 'Anchor ID'), text('label', 'Section label'), text('heading', 'Heading'), text('company', 'Company name'), text('lead', 'Lead paragraph', 'textarea'), text('body', 'Body paragraph', 'textarea'), text('image', 'Background image', 'image'), text('badges', 'Badges', 'lines'), text('contactLines', 'Contact lines', 'lines'), list('metrics', 'Metrics', [text('value', 'Value'), text('label', 'Label')])])] },
    ],
  },
  navigation: {
    title: 'Header & Navigation',
    description: 'Manage desktop/mobile menu links and every mega-menu preview shown in the public header.',
    singletonKey: 'siteNavigation',
    publicRoute: '/',
    defaults: DEFAULT_SITE_NAVIGATION,
    sections: [
      { title: 'Header actions', fields: [text('ctaText', 'Get in touch button'), text('companyPreviewEyebrow', 'Company preview eyebrow'), text('companyPreviewText', 'Company preview description', 'textarea'), text('companyPreviewImage', 'Company preview image', 'image')] },
      { title: 'Company menu', fields: [list('companyLinks', 'Company links', [text('label', 'Label'), text('to', 'Destination'), text('sub', 'Indented item', 'boolean')])] },
      { title: 'ESG menu', fields: [list('esgLinks', 'ESG links and previews', previewFields())] },
      { title: 'Media menu', fields: [list('mediaLinks', 'Media links and previews', previewFields())] },
      { title: 'Gallery menu', fields: [list('galleryLinks', 'Gallery links and previews', previewFields())] },
      { title: 'Careers menu', fields: [list('careerLinks', 'Careers links and previews', previewFields())] },
    ],
  },
  sustainability: {
    title: 'Sustainability',
    description: 'Manage ESG pillars, circular-economy messaging, initiatives, compliance cards, and CTA.',
    singletonKey: 'sustainabilityPage',
    publicRoute: '/sustainability',
    defaults: DEFAULT_SUSTAINABILITY_PAGE,
    sections: [
      { title: 'Hero', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image')] },
      { title: 'ESG pillars', fields: [text('pillarsLabel', 'Section label'), text('pillarsHeading', 'Section heading'), text('pillarsBackground', 'Section background', 'image'), list('pillars', 'Pillars', [text('title', 'Title'), text('points', 'Bullet points', 'lines')])] },
      { title: 'Zero liquid discharge band', fields: [text('highlightLabel', 'Label'), text('highlightHeading', 'Heading', 'textarea'), text('highlightText', 'Description', 'textarea')] },
      { title: 'Circular economy', fields: [text('circularLabel', 'Section label'), text('circularHeading', 'Heading'), text('circularLead', 'Lead paragraph', 'textarea'), text('circularBody', 'Second paragraph', 'textarea'), text('circularFootnote', 'Final paragraph', 'textarea'), list('circularStats', 'Statistics', [text('value', 'Value'), text('label', 'Label'), text('description', 'Description', 'textarea')])] },
      { title: 'Environmental initiatives', fields: [text('activitiesLabel', 'Section label'), text('activitiesHeading', 'Heading'), list('activities', 'Initiatives', [text('title', 'Title'), text('description', 'Description', 'textarea'), text('image', 'Image', 'image')])] },
      { title: 'Compliance framework', fields: [text('certificationsLabel', 'Section label'), text('certificationsHeading', 'Heading'), list('certifications', 'Certifications', [text('name', 'Name'), text('description', 'Description', 'textarea')])] },
      { title: 'Closing CTA', fields: [text('ctaLabel', 'Section label'), text('ctaHeading', 'Heading'), text('ctaText', 'Description', 'textarea'), text('ctaButton', 'Button label'), text('ctaBackground', 'Background image', 'image')] },
    ],
  },
  investors: {
    title: 'Investors',
    description: 'Manage investor page labels, KPI cards, chart headings, and governance messaging. Chart series remain live API data.',
    singletonKey: 'investorsPage',
    publicRoute: '/investors',
    defaults: DEFAULT_INVESTORS_PAGE,
    sections: [
      { title: 'Hero and metrics', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('metricsLabel', 'Section label'), text('metricsHeading', 'Section heading'), list('kpis', 'KPI cards', [text('label', 'Label'), text('value', 'Value'), text('trend', 'Trend'), text('highlighted', 'Highlight card', 'boolean')])] },
      { title: 'Charts', fields: [text('revenueChartTitle', 'Revenue chart title'), text('productionChartTitle', 'Production chart title')] },
      { title: 'Governance', fields: [text('governanceLabel', 'Section label'), text('governanceHeading', 'Heading'), text('governanceText', 'Description', 'textarea'), text('certifications', 'Certification badges', 'lines')] },
    ],
  },
  sourcing: {
    title: 'Sourcing',
    description: 'Manage accepted materials, grading criteria, import capability, contact details, and enquiry introduction.',
    singletonKey: 'sourcingPage',
    publicRoute: '/sourcing',
    defaults: DEFAULT_SOURCING_PAGE,
    sections: [
      { title: 'Hero and introduction', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('buyLabel', 'Section label'), text('buyHeading', 'Heading'), text('buyIntroduction', 'Introduction', 'textarea')] },
      { title: 'Materials purchased', fields: [list('materials', 'Materials', [text('title', 'Title'), text('description', 'Description', 'textarea')])] },
      { title: 'Acceptance criteria', fields: [text('criteriaLabel', 'Section label'), text('criteriaHeading', 'Heading'), list('criteria', 'Grade rows', [text('grade', 'Grade'), text('lead', 'Lead content'), text('form', 'Accepted form'), text('minimum', 'Minimum lot'), text('pricing', 'Pricing')])] },
      { title: 'Import capability', fields: [text('importLabel', 'Section label'), text('importHeading', 'Heading'), text('importLead', 'Lead paragraph', 'textarea'), text('importBody', 'Details', 'textarea'), list('importFacts', 'Import facts', [text('label', 'Label'), text('value', 'Value')])] },
      { title: 'Procurement contact', fields: [text('contactHeading', 'Heading'), text('contactText', 'Description', 'textarea'), text('contactDetails', 'Email and phone')] },
      { title: 'Enquiry form', fields: [text('formLabel', 'Section label'), text('formHeading', 'Heading'), text('formIntroduction', 'Introduction', 'textarea'), text('formSubmitButton', 'Submit button'), text('formSuccessMessage', 'Success message', 'textarea'), text('sellerImage', 'Side image', 'image'), text('benefitsHeading', 'Benefits heading'), text('benefits', 'Seller benefits', 'lines')] },
      { title: 'Direct sourcing contact', fields: [text('directContactLabel', 'Label'), text('directContactName', 'Name'), text('directContactRole', 'Role'), text('directContactPhone', 'Displayed phone'), text('directContactPhoneHref', 'Dial phone value'), text('directContactEmail', 'Email')] },
    ],
  },
  media: {
    title: 'Media Page',
    description: 'Manage the page hero and media tabs. Articles themselves are managed under News & Announcements.',
    singletonKey: 'mediaPage',
    publicRoute: '/media',
    defaults: DEFAULT_MEDIA_PAGE,
    sections: [
      { title: 'Page settings', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), list('types', 'Media tabs', [text('id', 'Internal ID'), text('label', 'Visible label')])] },
    ],
  },
  gallery: {
    title: 'Gallery Page',
    description: 'Manage the page hero and category labels. Gallery images remain under Gallery Manager.',
    singletonKey: 'galleryPage',
    publicRoute: '/gallery',
    defaults: DEFAULT_GALLERY_PAGE,
    sections: [
      { title: 'Page settings', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('emptyText', 'Empty-state message'), list('categories', 'Gallery categories', [text('id', 'Category ID'), text('title', 'Visible title')])] },
    ],
  },
  careers: {
    title: 'Careers Page',
    description: 'Manage the page presentation and role categories. Job records remain under Careers & Jobs.',
    singletonKey: 'careersPage',
    publicRoute: '/careers',
    defaults: DEFAULT_CAREERS_PAGE,
    sections: [
      { title: 'Page settings', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('sectionLabel', 'Section label'), text('heading', 'Heading'), text('emptyText', 'Empty-state message'), text('applyButton', 'Apply button label'), list('categories', 'Role categories', [text('id', 'Category ID'), text('name', 'Visible name')])] },
    ],
  },
  about: {
    title: 'About Us', description: 'Manage every About section; visible leadership uses the Team Manager when team records exist.', singletonKey: 'aboutPage', publicRoute: '/about', defaults: DEFAULT_ABOUT_PAGE,
    sections: [
      { title: 'Overview', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('overviewLabel', 'Section label'), text('overviewHeading', 'Heading'), text('overviewLead', 'Lead paragraph', 'textarea'), text('overviewBody', 'Body paragraph', 'textarea'), text('overviewImage', 'Overview image', 'image'), text('overviewImageCaption', 'Image caption')] },
      { title: 'Principles', fields: [text('principlesLabel', 'Section label'), text('principlesHeading', 'Heading'), list('principles', 'Principles', [text('title', 'Title'), text('description', 'Description', 'textarea')])] },
      { title: 'Leadership', fields: [text('leadershipLabel', 'Section label'), text('leadershipHeading', 'Heading'), list('leadership', 'Fallback leaders', [text('name', 'Name'), text('role', 'Role'), text('bio', 'Biography', 'textarea'), text('image', 'Photo', 'image')])] },
      { title: 'Timeline', fields: [text('timelineLabel', 'Section label'), text('timelineHeading', 'Heading'), text('timelineIntroduction', 'Introduction', 'textarea'), list('timeline', 'Milestones', [text('year', 'Year'), text('title', 'Title'), text('description', 'Description', 'textarea')])] },
      { title: 'Certifications', fields: [text('certificationsLabel', 'Section label'), text('certificationsHeading', 'Heading'), list('certifications', 'Certifications', [text('name', 'Name'), text('description', 'Description'), text('scope', 'Scope')])] },
    ],
  },
  contact: {
    title: 'Contact', description: 'Manage public contact details, locations, headings, and enquiry feedback copy.', singletonKey: 'contactPage', publicRoute: '/contact', defaults: DEFAULT_CONTACT_PAGE,
    sections: [
      { title: 'Page introduction', fields: [text('heroTitle', 'Hero title'), text('heroImage', 'Hero background', 'image'), text('sectionLabel', 'Section label'), text('heading', 'Heading'), text('introduction', 'Introduction', 'textarea')] },
      { title: 'Locations and contact', fields: [text('locationsHeading', 'Locations heading'), list('locations', 'Locations', [text('label', 'Label'), text('value', 'Address', 'textarea')]), text('phoneHeading', 'Phone heading'), text('phoneLines', 'Phone lines', 'lines'), text('emailHeading', 'Email heading'), text('emails', 'Email addresses', 'lines')] },
      { title: 'Enquiry form', fields: [text('formLabel', 'Form label'), text('formHeading', 'Form heading'), text('submitButton', 'Submit button'), text('successMessage', 'Success message', 'textarea')] },
    ],
  },
  footer: {
    title: 'Footer', description: 'Manage footer CTA, navigation, entities, contact details, and compliance badges.', singletonKey: 'footerContent', publicRoute: '/', defaults: DEFAULT_FOOTER_CONTENT,
    sections: [
      { title: 'CTA band', fields: [text('ctaLabel', 'Label'), text('ctaHeading', 'Heading'), text('ctaText', 'Description', 'textarea'), text('primaryButton', 'Primary button'), text('secondaryButton', 'Secondary button')] },
      { title: 'Brand and links', fields: [text('brandStatement', 'Brand statement', 'textarea'), text('certifications', 'Certification badges', 'lines'), list('quickLinks', 'Quick links', [text('label', 'Label'), text('to', 'Destination')]), list('entities', 'Entities', [text('code', 'Code'), text('name', 'Name'), text('location', 'Location'), text('to', 'Destination')])] },
      { title: 'Contact details', fields: [text('address', 'Address', 'textarea'), text('phone', 'Phone'), text('email', 'Email'), text('cin', 'CIN'), text('established', 'Established line'), text('linkedinUrl', 'LinkedIn URL'), text('xUrl', 'X / Twitter URL'), text('bottomBadges', 'Bottom badges', 'lines')] },
    ],
  },
  heroes: {
    title: 'Page Hero Images', description: 'Manage the default banner image used by every public page.', singletonKey: 'pageHeroImages', publicRoute: '/about', defaults: DEFAULT_PAGE_HERO_IMAGES,
    sections: [{ title: 'Public page banners', fields: Object.keys(DEFAULT_PAGE_HERO_IMAGES).map((key) => text(key, key, 'image')) }],
  },
};

function previewFields() {
  return [
    text('label', 'Menu label'),
    text('to', 'Destination'),
    text('previewEyebrow', 'Preview eyebrow'),
    text('previewText', 'Preview description', 'textarea'),
    text('previewImage', 'Preview image', 'image'),
  ];
}

export const PUBLIC_PAGE_ORDER = ['home', 'businesses', 'navigation', 'heroes', 'about', 'contact', 'footer', 'sustainability', 'investors', 'sourcing', 'media', 'gallery', 'careers'];
