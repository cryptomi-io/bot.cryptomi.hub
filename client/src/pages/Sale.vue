<script setup>
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
// import FAQ from '@/components/ui/FAQ.vue'
import UserBalance from '@/components/user/UserBalance.vue'
import PresaleForm from '@/components/presale/PresaleForm.vue'
import PresaleTokenomics from '@/components/presale/PresaleTokenomics.vue'
import PresaleBenefits from '@/components/presale/PresaleBenefits.vue'

const faqTerms = [
  {
    title: 'What is a SAAS platform?',
    description:
      'SAAS platform is a cloud-based software service that allows users to access and use a variety of tools and functionality.'
  },
  {
    title: 'How does billing work?',
    description:
      'We offers a variety of billing options, including monthly and annual subscription plans, as well as pay-as-you-go pricing for certain services. Payment is typically made through a credit card or other secure online payment method.'
  },
  {
    title: 'Can I get a refund for my subscription?',
    description:
      'We offers a 30-day money-back guarantee for most of its subscription plans. If you are not satisfied with your subscription within the first 30 days, you can request a full refund. Refunds for subscriptions that have been active for longer than 30 days may be considered on a case-by-case basis.'
  },
  {
    title: 'How do I cancel my subscription?',
    description:
      'To cancel your We subscription, you can log in to your account and navigate to the subscription management page. From there, you should be able to cancel your subscription and stop future billing.'
  },
  {
    title: 'Can I try this platform for free?',
    description:
      'We offers a free trial of its platform for a limited time. During the trial period, you will have access to a limited set of features and functionality, but you will not be charged.'
  },
  {
    title: 'How do I access documentation?',
    description:
      "Documentation is available on the company's website and can be accessed by logging in to your account. The documentation provides detailed information on how to use the , as well as code examples and other resources."
  },
  {
    title: 'How do I contact support?',
    description:
      "If you need help with the platform or have any other questions, you can contact the company's support team by submitting a support request through the website or by emailing support@We.com."
  },
  {
    title: 'Do you offer any discounts or promotions?',
    description:
      "We may offer discounts or promotions from time to time. To stay up-to-date on the latest deals and special offers, you can sign up for the company's newsletter or follow it on social media."
  },
  {
    title: 'How do we compare to other similar services?',
    description:
      'This platform is a highly reliable and feature-rich service that offers a wide range of tools and functionality. It is competitively priced and offers a variety of billing options to suit different needs and budgets.'
  }
]
</script>

<template>
  <div class="flex flex-col gap-5">
    <UserBalance />
    <PresaleForm />
    <PresaleTokenomics />
    <PresaleBenefits />
    <!-- <FAQ title='FAQ' subtitle='Frequenty asked questions' :faqTerms="faqTerms" /> -->
  </div>
</template>
