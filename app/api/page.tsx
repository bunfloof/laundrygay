import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Endpoint {
  path: string;
  method: HttpMethod;
  description: string;
  requestBody?: Record<string, string>;
  queryParams?: Record<string, string>;
  exampleRequest: string;
}

const ApiPage: React.FC = () => {
  const endpoints: Endpoint[] = [
    {
      path: "/",
      method: "POST",
      description: "Start a laundry machine",
      requestBody: {
        location: "string",
        room: "string",
        machine: "string"
      },
      exampleRequest: `curl -X POST https://laundry.ucsc.gay/ \\
  -H "Content-Type: application/json" \\
  -d '{"location": "<selectedLocation>", "room": "<selectedRoom>", "machine": "<selectedMachine>"}'`
    },
    {
      path: "/clients",
      method: "GET",
      description: "Retrieve a list of supported clients",
      queryParams: {
        page: "number (optional)",
        limit: "number (optional)"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/clients?page=1&limit=10" \\
  -H "Content-Type: application/json"`
    }
  ];

  const MethodBadge: React.FC<{ method: HttpMethod }> = ({ method }) => {
    const colorClass = method === 'GET' ? 'bg-green-500' : 'bg-blue-500';
    return (
      <Badge className={`${colorClass} text-white font-semibold mr-2`}>
        {method}
      </Badge>
    );
  };

  const EndpointSection: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => (
    <section className="mb-8">
      
      <div className="bg-secondary p-3 rounded-md mb-4">
        <code className="text-sm font-mono">{endpoint.path}</code>
      </div>
    
      <p className="text-base mb-4 leading-relaxed">{endpoint.description}</p>
      
      <h4 className="text-lg font-semibold mb-2">Method</h4>
      <div className="bg-secondary p-3 rounded-md mb-4">
        <code className="text-sm font-mono">{endpoint.method}</code>
      </div>
      
      {endpoint.requestBody && (
        <>
          <h4 className="text-lg font-semibold mb-2">Request Body</h4>
          <p className="text-base mb-2">The request body should be a JSON object with the following properties:</p>
          <ul className="list-disc list-inside mb-4">
            {Object.entries(endpoint.requestBody).map(([key, value]) => (
              <li key={key}><code className="text-sm font-mono">{key}</code>: {value}</li>
            ))}
          </ul>
        </>
      )}
      
      {endpoint.queryParams && (
        <>
          <h4 className="text-lg font-semibold mb-2">Query Parameters</h4>
          <ul className="list-disc list-inside mb-4">
            {Object.entries(endpoint.queryParams).map(([key, value]) => (
              <li key={key}><code className="text-sm font-mono">{key}</code>: {value}</li>
            ))}
          </ul>
        </>
      )}
      
      <h4 className="text-lg font-semibold mb-2">Example Request</h4>
      <div className="bg-secondary p-3 rounded-md mb-4 overflow-x-auto">
        <pre className="text-sm font-mono">{endpoint.exampleRequest}</pre>
      </div>
    </section>
  );

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
              <BreadcrumbPage>API Documentation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-6">API Documentation</h1>

        <section className="mb-2">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-base mb-4 leading-relaxed">
            Our API is free to use. We provide endpoints for starting laundry machines and retrieving client information.
          </p>
        </section>

        <Tabs defaultValue="endpoints" className="mb-8">
          {/* <TabsList>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
          </TabsList> */}
          <TabsContent value="endpoints">
            <Accordion type="single" collapsible className="w-full">
              {endpoints.map((endpoint, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <span className="text-lg font-semibold flex items-center">
                      <MethodBadge method={endpoint.method} />
                      {endpoint.path}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <EndpointSection endpoint={endpoint} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="authentication">
            <p className="text-base mb-4 leading-relaxed">
              Currently, our API does not require authentication. However, we recommend keeping an eye on our documentation 
              for any future updates regarding API access and security.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiPage;