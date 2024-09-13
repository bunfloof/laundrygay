'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Send, Copy } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

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
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
  const [requestBody, setRequestBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("endpoints");
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<string | null>(null);

  const endpoints: Endpoint[] = [
    {
      path: "/",
      method: "POST",
      description: "Puts a laundry machine in start mode",
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
      path: "/client",
      method: "GET",
      description: "Retrieve client information",
      queryParams: {
        location: "string",
        room: "string",
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/clients?location=<locationId>&room=<roomId>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/clients",
      method: "GET",
      description: "Retrieve a list of supported clients",
      queryParams: {
        page: "number (optional)",
        limit: "number (optional)"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/clients" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/machines",
      method: "GET",
      description: "Retrieve a live list of machines in a room",
      queryParams: {
        location: "string",
        room: "string",
        machine: "string"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/machines?location=<locationId>&room=<roomId>&machine=<license>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/machinehealth",
      method: "GET",
      description: "Retrieve the health of a machine.",
      queryParams: {
        location: "string",
        room: "string",
        machine: "string"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/machinehealth?location=<locationId>&room=<roomId>&machine=<license>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/machinestatus",
      method: "GET",
      description: "Retrieve the status of a machine.",
      queryParams: {
        location: "string",
        room: "string",
        machine: "string"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/machinestatus?location=<locationId>&room=<roomId>&machine=<license>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/qr",
      method: "GET",
      description: "Retrieve machine information from a QR code",
      queryParams: {
        code: "string",
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/qr?code=<qrcode>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/room",
      method: "GET",
      description: "Retrieve cached list of machines in a room",
      queryParams: {
        location: "string",
        room: "string",
        machine: "string"
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/machines_archive?location=<locationId>&room=<roomId>&machine=<license>" \\
  -H "Content-Type: application/json"`
    },
    {
      path: "/status",
      method: "GET",
      description: "Retrieve client status",
      queryParams: {
        location: "string",
        room: "string",
      },
      exampleRequest: `curl -X GET "https://laundry.ucsc.gay/status" \\
  -H "Content-Type: application/json"`
    },
  ];

  const MethodBadge: React.FC<{ method: HttpMethod }> = ({ method }) => {
    const colorClass = {
      GET: 'bg-green-500',
      POST: 'bg-blue-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500',
      PATCH: 'bg-purple-500',
    }[method];

    return (
      <Badge className={`${colorClass} text-white font-semibold mr-2`}>
        {method}
      </Badge>
    );
  };
  
  useEffect(() => {
    if (activeEndpoint && activeEndpoint.queryParams) {
      const initialQueryParams = Object.fromEntries(
        Object.keys(activeEndpoint.queryParams).map(key => [key, ''])
      );
      setQueryParams(initialQueryParams);
    }
  }, [activeEndpoint]);

  const handleEndpointSelect = (endpoint: Endpoint) => {
    setActiveEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.requestBody || {}, null, 2));
    setQueryParams(endpoint.queryParams || {});
    setResponse('');
    setActiveTab("playground");
  };

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      if (!activeEndpoint) {
        throw new Error('No active endpoint selected');
      }
      const url = new URL(`https://laundry.ucsc.gay${activeEndpoint.path}`);
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        method: activeEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: activeEndpoint.method !== 'GET' ? requestBody : undefined,
      });

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Request Sent",
        description: "The API request was sent successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse(JSON.stringify({ error: 'An error occurred while sending the request.' }, null, 2));
      toast({
        title: "Error",
        description: "An error occurred while sending the request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedTooltip(id);
    setTimeout(() => setShowCopiedTooltip(null), 2000); // Hide tooltip after 2 seconds
  };

  const EndpointSection: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => (
    <section className="mb-8">
      
      <div className="bg-secondary p-3 rounded-md mb-4">
        <code className="text-sm font-mono">{endpoint.path}</code>
      </div>
    
      <p className="text-sm mb-4 leading-relaxed">
        {endpoint.description}
      </p>
      
      <h4 className="text-lg font-semibold mb-2">Method</h4>
      <div className="bg-secondary p-3 rounded-md mb-4">
        <code className="text-sm font-mono">{endpoint.method}</code>
      </div>
        
        {endpoint.requestBody && (
          <>
            <h4 className="text-lg font-semibold mt-4 mb-2">Request Body</h4>
            <p className="text-sm mb-2">The request body should be a JSON object with the following properties:</p>
            <ul className="list-disc list-inside mb-4">
              {Object.entries(endpoint.requestBody).map(([key, value]) => (
                <li key={key}><code className="text-sm font-mono">{key}</code>: {value}</li>
              ))}
            </ul>
          </>
        )}
        
        {endpoint.queryParams && (
          <>
            <h4 className="text-lg font-semibold mt-4 mb-2">Query Parameters</h4>
            <ul className="list-disc list-inside mb-4">
              {Object.entries(endpoint.queryParams).map(([key, value]) => (
                <li key={key}><code className="text-sm font-mono">{key}</code>: {value}</li>
              ))}
            </ul>
          </>
        )}
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Example Request</h4>
        <div className="bg-secondary p-3 rounded-md mb-4 overflow-x-auto relative">
          <pre className="text-sm font-mono">{endpoint.exampleRequest}</pre>
          <TooltipProvider>
          <Tooltip open={showCopiedTooltip === endpoint.path}>
            <TooltipTrigger asChild>
              <button
                className="absolute top-2 right-2 p-1 rounded-md text-foreground/50 hover:text-foreground transition-colors duration-200"
                onClick={() => copyToClipboard(endpoint.exampleRequest, endpoint.path)}
                aria-label="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copied!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
        <Button onClick={() => handleEndpointSelect(endpoint)}>Try</Button>
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
            Our API is free to use. We provide endpoints for starting laundry machines and retrieving client information. Do not spam our API or else the WAF will go alpha wolf mode 👹.
          </p>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="playground">Test</TabsTrigger>
          </TabsList>
          <TabsContent value="endpoints">
            <Accordion type="multiple" className="w-full">
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
          <TabsContent value="playground">
            <div className="flex flex-col md:flex-row p-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Request</h3>
                {activeEndpoint ? (
                  <>
                    <div className="mb-4">
                      <Label>Selected Endpoint</Label>
                      <div className="flex items-center mt-2">
                        <MethodBadge method={activeEndpoint.method} />
                        <code className="text-sm font-mono">{activeEndpoint.path}</code>
                      </div>
                    </div>
                    {activeEndpoint.queryParams && (
                      <div className="mb-4">
                        <Label>Query Parameters</Label>
                        {Object.entries(activeEndpoint.queryParams).map(([key, value]) => (
                          <div key={key} className="mt-2">
                            <Label htmlFor={key}>{key}</Label>
                            <Input
                              className='mt-0.5'
                              id={key}
                              value={queryParams[key] || ''}
                              onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                              placeholder={value}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {activeEndpoint.requestBody && (
                      <div className="mb-4">
                        <Label htmlFor="requestBody">Request Body</Label>
                        <Textarea
                          id="requestBody"
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          rows={10}
                        />
                      </div>
                    )}
                    <Button onClick={handleSendRequest} disabled={loading}>
                      {loading ? 'Sending...' : 'Send Request'}
                    </Button>
                  </>
                ) : (
                  <p className='text-sm'>Select an endpoint from the “Endpoints” tab to start</p>
                )}
              </div>

              <Separator className="my-4 md:my-0 md:mx-4 h-[1px] md:h-auto md:w-[1px]" />

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Response</h3>
                {response ? (
                  <div className="relative">
                    <div className="p-2 bg-secondary text-secondary-foreground rounded-md overflow-auto max-h-[50vh]">
                      <pre className="whitespace-pre-wrap break-words text-xs">
                        {response}
                      </pre>
                    </div>
                    <TooltipProvider>
                      <Tooltip open={showCopiedTooltip === 'response'}>
                        <TooltipTrigger asChild>
                          <button
                            className="absolute top-2 right-2 p-1 rounded-md text-foreground/50 hover:text-foreground transition-colors duration-200"
                            onClick={() => copyToClipboard(response, 'response')}
                            aria-label="Copy response to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copied!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <p className='text-sm'>No response yet. Send a request to see the result.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiPage;