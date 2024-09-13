'use client'

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'

const PaperPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" passHref legacyBehavior>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Paper</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <img src="/banner.jpg" alt="Communism0" className="w-full rounded-lg mb-8" />
        <h1 className="text-3xl font-bold mb-8">Eat the Rich, Feed the Poor</h1>
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Right to Free Laundry</h2>
          <p className="text-base mb-4 leading-relaxed">
            We believe that everyone deserves access to laundry without capitalist exploitation that perpetuate white supremacy and economic inequality. The commodification of basic needs is a weapon of the capitalist system that oppresses the working class and imposes a racial hierarchy. Laundry should be free for the people by the people.
          </p>
        </section>

        <Gallery>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">In Solidarity with Palestine</h2>
            <p className="text-base mb-4 leading-relaxed">
              Support our friends at <Button variant="link" className="p-0 h-auto text-blue-400"><Link href="https://linktr.ee/ucscsjp" rel="noopener noreferrer" target="_blank">SJP (Students for Justice in Palestine at UCSC)</Link></Button>. The funds you would otherwise spend on these exploitative laundry machines can go towards supporting Palestinian Liberation. We must stand in solidarity with all oppressed people, reject any capitalist and zionist systems, and redirect your support to the liberation movements that fight for justice and freedom.
            </p>
          </section> 
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Some Technical Details</h2>
            <div className="my-6">
              <Item
                original="/ida64_UR34RN8NaA.png"
                thumbnail="/ida64_UR34RN8NaA.png"
                width="1024"
                height="600"
                alt="Communism1"
              >
                {({ ref, open }) => (
                  <img 
                    ref={ref as React.Ref<HTMLImageElement>}
                    onClick={open}
                    src="/ida64_UR34RN8NaA.png" 
                    alt="Communism1" 
                    className="w-full rounded-lg cursor-pointer" 
                  />
                )}
              </Item>
              <p className="text-center text-sm text-foreground mt-2">Figure 1: fingering cschub binary</p>
            </div>
            {/* <h2 className="text-xl font-bold mb-4">Preface</h2>
              <p className="text-base mb-4 leading-relaxed">
              Ok so csc serviceworks be stealing my money, not fixing machines, ruining and burning clothes, and not giving me refunds. csc serviceworks is a $5 billion dollar corporation, FUCK YOU CAPITALISTS. i fucking hate rich people, especially privileged white people.
              <br />
              <br />
              fucking white people and right wingers always calling the cops on us for no reason. every time i see white people, it makes my blood boil. for those POCs who are still be hanging out with white people, you need to change for the better or be sent to re-education camps, especially yellow striped Vietnamese refugees in the United States. I ain’t none of that yellow red stripe shit. YOU LOST THE VIETNAM WAR losers that’s why you’re here bending down to the US and people like Donald Trump who’s always talking about fighting China. 60% of the Vietnamese in the United States are BRAINWASHED REPUBLICANS. i fly the red flag with the star, not the yellow flag with 3 red stripes YOU FUCKING REPUBLICANS. i simply don’t feel comfortable associating with a flag that reeks of right wingers. 
              <br />
              <br />
              So fuck the Vietnamese culture here, it’s a boba liberalism of Southern Vietnamese’s misguided belief in the US’s right-wing, anti-communism propaganda, and the “American Dream.” Y’all Việt kiều here act hot shit putting the Vietnamese flag 🇻🇳 in your instagram bios, but you ain’t a true Viet G. You’re a fake three striped brainwashed baby born in the United States for entertainment purposes. I bet you monotone asses only understand the southern Vietnamese dialect because that’s what sore losers like your mother and refugees speak. You ain’t from the motherland like me. You’re only from a mother in the United States.
              <br />
              <br />
              so back to my point, white people are not your friends and will never be your friends. i learned that the hard way and i taught my POC friends that too. if you see a white entity, you better take advantage of them before they take advantage of you. white people will serve us. call that reparations for what they’ve done to us for centuries. that’s exactly what we are gonna do here.
            </p> */}
            <h2 className="text-xl font-bold mb-4">Compromised at the source</h2>
              <p className="text-base mb-4 leading-relaxed">
                BrightAI is the company responsible for the cschub software that runs these Internet of Things (IoT) laundry machines. Each laundry machine is equipped with a Raspberry Pi, which is its primary communication interface. Each machine connect to a hub via a WiFi access point (SSID: csc-hub-0000). Each machine is assigned a unique IP address within a local WireGuard virtual private network using the 10.200.0.0/24 subnet.
              </p>
            <div className="my-6">
            <Item
              original="/Sclient_FjqDtmVXSS.png"
              thumbnail="/Sclient_FjqDtmVXSS.png"
              width="1024"
              height="690"
              alt="Communism2"
            >
              {({ ref, open }) => (
                <img 
                  ref={ref as React.Ref<HTMLImageElement>}
                  onClick={open}
                  src="/Sclient_FjqDtmVXSS.png" 
                  alt="Communism2" 
                  className="w-full rounded-lg cursor-pointer" 
                />
              )}
            </Item>
            <p className="text-center text-sm text-foreground mt-2">Figure 2: csc devs be like 💀</p>
            </div>
            <p className="text-base mb-4 leading-relaxed">
              Too bad their software developers intentionally doesn’t follow best security practices. We’ve uploaded our infected payload to the BrightAI API, the hubs download the infected code, and we gain remote root access to all of their hubs and servers. We’ve reverse engineered the cschub binary, developed, and injected our own code into their hubs. We wish we could’ve found their source code earlier from that one intern’s GitHub account, so we didn’t have to IDA64 their binary.
            </p>
          </section>
          {/* <section>
            <h2 className="text-2xl font-bold mb-4">Hosted in Vietnam</h2>
            <div className="my-6">
              <Item
                original="/r92a0jfa9.jpg"
                thumbnail="/r92a0jfa9.jpg"
                width="1200"
                height="630"
                alt="Communism3"
              >
                {({ ref, open }) => (
                  <img 
                    ref={ref as React.Ref<HTMLImageElement>}
                    onClick={open}
                    src="/r92a0jfa9.jpg" 
                    alt="Communism3" 
                    className="w-full rounded-lg cursor-pointer" 
                  />
                )}
              </Item>
              <p className="text-center text-sm text-foreground mt-2">Figure 3: i love viet nam</p>
            </div>
            <p className="text-base mb-4 leading-relaxed">
              Our infrastructure, including this website and API is strategically hosted in Vietnam on VNPT’s nortorious network known for torrenting movies. Cloudflare abuse most likely won’t do much except give you the real IP of this website. The Vietnamese government doesn’t bend down to U.S. corporate interests or their capitalist agendas. Good luck taking it down if you even care.
            </p>
           
          </section> */}
        </Gallery>
      </div>
    </div>
  );
};

export default PaperPage;