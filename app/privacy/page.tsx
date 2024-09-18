'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import 'photoswipe/dist/photoswipe.css'
import { useRouter } from 'next/navigation';

const PrivacyPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>
                <BreadcrumbLink>
                  <button onClick={() => router.back()}>Back</button>
                </BreadcrumbLink>
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Privacy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Data Collection and Storage</h2>
          <p className="text-base mb-4 leading-relaxed">
            When you use our laundry app, we collect and store the following information:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Timestamp of laundry start requests</li>
            <li>Location, room, and machine information for laundry requests</li>
            <li>Email address (if provided)</li>
          </ul>
          <p className="text-base mb-4 leading-relaxed">
            We also store some information in your device’s local storage, including defaultTab, email (if provided), laundryMachines, offsetTime, selectedAPI, and theme.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
          <p className="text-base mb-4 leading-relaxed">
            We use your data solely for the quality and control purposes providing our laundry app. This includes:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Processing laundry start requests</li>
            <li>Notifying you when your laundry is about to be done (if you provided your email)</li>
            <li>Improving our service based on usage patterns</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
          <p className="text-base mb-4 leading-relaxed">
            We retain laundry request logs only temporarily. Once our server program is exited, these logs are not retained. If you provide your email, it’s stored temporarily on our server and is deleted removed immediately after delivery or after one hour.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
          <p className="text-base mb-4 leading-relaxed">
            We use the following third-party services for our operation. These services are:
          </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>cloudflare.com (“Cloudflare Inc.”) — CDN provider</li>
            <li>cn.aliyun.com (“阿里云 邮件推送”) — “DirectMail” for email delivery</li>
            <li>cscsw.com (“CSC ServiceWorks Inc.”) — to fetch information about laundry machines</li>
          </ul>
          <p className="text-base mb-4 leading-relaxed">
            As user data actively passes through these services the privacy policies of the aforementioned services also apply to data subjects of the controller. Their respective privacy policies, in order of the aforementioned, are listed here:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Cloudflare Inc — <Button variant="link" className="p-0 h-auto text-blue-400"><Link href="https://www.cloudflare.com/privacypolicy/" rel="noopener noreferrer" target="_blank">https://www.cloudflare.com/privacypolicy/</Link></Button></li>
            <li>Aliyun — <Button variant="link" className="p-0 h-auto text-blue-400"><Link href="https://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud201902141711_54837.html?spm=5176.28508143.J_9220772140.7.425e154a37W2nX" rel="noopener noreferrer" target="_blank">https://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud201902141711_54837.html</Link></Button></li>
            <li>CSC Serviceworks — <Button variant="link" className="p-0 h-auto text-blue-400"><Link href="https://www.cscsw.com/privacy-policy/" rel="noopener noreferrer" target="_blank">https://www.cscsw.com/privacy-policy/</Link></Button></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Data Storage Location</h2>
          <p className="text-base mb-4 leading-relaxed">
            Any and all information, General and Personal is stored on servers operated by the provider from their own property or a rented service with any of the following Tier 3 Secure Data Center Providers: Aliyun, Foxomyvn. These servers are located in China and Vietnam.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;