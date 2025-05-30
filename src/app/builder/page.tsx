'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StepsList } from '@/components/builder/StepsList';
import { FileExplorer } from '@/components/builder/FileExplorer';
import { TabView } from '@/components/builder/TabView';
import { CodeEditor } from '@/components/builder/CodeEditor';
import { PreviewFrame } from '@/components/builder/PreviewFrame';
import axios from 'axios';
import { BACKEND_URL } from './config';
import { parseXml } from './steps';
import { useWebContainer } from '../../../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '@/components/builder/Loader';
import { FileItem, Step, StepType } from '../../../types';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

function BuilderContent() {
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');
    const [userPrompt, setPrompt] = useState("");
    const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [templateSet, setTemplateSet] = useState(false);
    const webcontainer = useWebContainer();

    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const [steps, setSteps] = useState<Step[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);

    useEffect(() => {
        let originalFiles = [...files];
        let updateHappened = false;
        steps.filter(({ status }) => status === "pending").map(step => {
            updateHappened = true;
            if (step?.type === StepType.CreateFile) {
                let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
                let currentFileStructure = [...originalFiles]; // {}
                let finalAnswerRef = currentFileStructure;

                let currentFolder = ""
                while (parsedPath.length) {
                    currentFolder = `${currentFolder}/${parsedPath[0]}`;
                    let currentFolderName = parsedPath[0];
                    parsedPath = parsedPath.slice(1);

                    if (!parsedPath.length) {
                        // final file
                        let file = currentFileStructure.find(x => x.path === currentFolder)
                        if (!file) {
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'file',
                                path: currentFolder,
                                content: step.code
                            })
                        } else {
                            file.content = step.code;
                        }
                    } else {
                        /// in a folder
                        let folder = currentFileStructure.find(x => x.path === currentFolder)
                        if (!folder) {
                            // create the folder
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'folder',
                                path: currentFolder,
                                children: []
                            })
                        }

                        currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
                    }
                }
                originalFiles = finalAnswerRef;
            }

        })

        if (updateHappened) {

            setFiles(originalFiles)
            setSteps(steps => steps.map((s: Step) => {
                return {
                    ...s,
                    status: "completed"
                }

            }))
        }
    }, [steps, files]);

    useEffect(() => {
        const createMountStructure = (files: FileItem[]): Record<string, any> => {
            const mountStructure: Record<string, any> = {};

            const processFile = (file: FileItem, isRootFolder: boolean) => {
                if (file.type === 'folder') {
                    // For folders, create a directory entry
                    mountStructure[file.name] = {
                        directory: file.children ?
                            Object.fromEntries(
                                file.children.map(child => [child.name, processFile(child, false)])
                            )
                            : {}
                    };
                } else if (file.type === 'file') {
                    if (isRootFolder) {
                        mountStructure[file.name] = {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    } else {
                        // For files, create a file entry with contents
                        return {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    }
                }

                return mountStructure[file.name];
            };

            // Process each top-level file/folder
            files.forEach(file => processFile(file, true));

            return mountStructure;
        };

        const mountStructure = createMountStructure(files);

        // Mount the structure if WebContainer is available
        webcontainer?.mount(mountStructure);
    }, [files, webcontainer]);

    async function init() {
        const response = await axios.post(`${BACKEND_URL}/api/template`, {
            prompt: prompt?.trim()
        });
        setTemplateSet(true);

        const { prompts, uiPrompts } = response.data;
        setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
            ...x,
            status: "pending"
        })));

        setLoading(true);
        const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
            messages: [...prompts, prompt].map(content => ({
                role: "user",
                content
            }))
        })

        setLoading(false);
        console.log("stepsResponse 3", stepsResponse.data.slice(0, 100))
        setSteps(s => [...s, ...parseXml(stepsResponse.data).map(x => ({
            ...x,
            status: "pending" as "pending"
        }))]);

        setLlmMessages([...prompts, prompt].map(content => ({
            role: "user",
            content
        })));

        setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }])
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
                <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
            </header>

            <div className="flex-1 overflow-hidden">
                <div className="h-full grid grid-cols-4 gap-6 p-6">
                    <div className="col-span-1 space-y-6 overflow-auto">
                        <div>
                            <div className="max-h-[75vh] overflow-scroll">
                                <StepsList
                                    steps={steps}
                                    currentStep={currentStep}
                                    onStepClick={setCurrentStep}
                                />
                            </div>
                            <div>
                                <div className='flex'>
                                    <br />
                                    {(loading || !templateSet) && <Loader />}
                                    {!(loading || !templateSet) && <div className='flex'>
                                        <textarea value={userPrompt} onChange={(e) => {
                                            setPrompt(e.target.value)
                                        }} className='p-2 w-full'></textarea>
                                        <button onClick={async () => {
                                            const newMessage = {
                                                role: "user" as "user",
                                                content: userPrompt
                                            };

                                            setLoading(true);
                                            const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
                                                messages: [...llmMessages, newMessage]
                                            });
                                            setLoading(false);

                                            setLlmMessages(x => [...x, newMessage]);
                                            setLlmMessages(x => [...x, {
                                                role: "assistant",
                                                content: stepsResponse.data.response
                                            }]);
                                            console.log("stepsResponse 2", stepsResponse.data.slice(0, 100))
                                            setSteps(s => [...s, ...parseXml(stepsResponse.data).map(x => ({
                                                ...x,
                                                status: "pending" as "pending"
                                            }))]);

                                        }} className='bg-purple-400 px-4'>Send</button>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <FileExplorer
                            files={files}
                            onFileSelect={setSelectedFile}
                        />
                    </div>
                    <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
                        <TabView activeTab={activeTab} onTabChange={setActiveTab} />
                        <div className="h-[calc(100%-4rem)]">
                            {activeTab === 'code' ? (
                                <CodeEditor file={selectedFile} />
                            ) : (
                                <PreviewFrame webContainer={webcontainer!} files={files} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Builder() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>}>
            <BuilderContent />
        </Suspense>
    );
}