import { useContext, useEffect, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import EntryUI from "../components/EntryUI";
import { Annotation, AnnotationContract, Labels } from "../../api.ts";
import { useNavigate } from "react-router-dom";
import { userContextType, userContext } from "@/context.ts";
import { ClientInferResponseBody } from "@ts-rest/core";
import { Nullable, checkForServerError } from "@/lib/utils.ts";
import { useToast } from '@/components/ui/use-toast';

type assignedAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getAssignedAnnotations'], 200> 
type pastAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getPastAnnotations'], 200>
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type assignedAnnotationType = UnwrapArray<assignedAnnotationTypeArray>;
type pastAnnotationType = UnwrapArray<pastAnnotationTypeArray>;


const AnnotationTool = () => {
    const {user} = useContext(userContext) as userContextType;
    const [_, setIsAuthenticated] = useState(false);
    const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);
    const data = useRef<(assignedAnnotationType | pastAnnotationType)[]>([]);
    const {toast} = useToast();
    const labelsToSubmit = useRef<Nullable<Labels>>({
        islamic : null,
        hateful : null
    }); 
    const navigate = useNavigate();

    useEffect(() => {
        user ? setIsAuthenticated(true) : navigate("/login");
    }, [])

    function fetchInitialTasks() {
        console.log("getting initial tasks...")
        if (user) {
            return Annotation.getAssignedAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    if (body.length < 5) {
                        return Annotation.reserveAnnotation({
                            headers: {
                                authorization: `Bearer ${user.token}`
                            },                        
                        }).then(({status, body}) => {
                            checkForServerError(status, toast);
                            if (status == 200) {
                                console.log("reserving tasks...")
                                return body.sort((a, b) => a.id - b.id)
                            }
                        })
                    }
                    else { 
                        return body.sort((a, b) => a.id - b.id);
                    }
                }
            })
        }
    }

    function fetchMoreTasks() {
        console.log("getting more tasks...")
        if (user) {
            return Annotation.reserveAnnotation({
                headers: {
                    authorization: `Bearer ${user.token}`
                },                        
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    console.log("reserving tasks...")
                    return body.sort((a, b) => a.id - b.id)
                }
            })
        }
    }
    
    function fetchHistory() {
        console.log("getting history...")
        if (user) {
            return Annotation.getPastAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                query : {
                    take: 10
                }
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    console.log("past annotations", status, body);
                    return body;
                }
            })
        }
    }


    useEffect(() => {
        Promise.all([
            fetchInitialTasks(),
            fetchHistory()
        ]).then(([tasks, history]) => {
            console.log(tasks);
            if (tasks) {
                if (history) {
                    data.current = history.reverse()
                    data.current = data.current.concat(tasks)
                    setActiveEntryIndex(history.length);
                }
                else {
                    data.current = tasks
                    setActiveEntryIndex(0);
                }
            }
        })
      }, [])

    const onChange = (labels : Nullable<Labels>) => {
        labelsToSubmit.current = labels;
    }

    const checkDisabled = () => {
        return labelsToSubmit.current.hateful === null || labelsToSubmit.current.islamic === null
    }

    const incrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null) {
            if ((data.current.length-1) - activeEntryIndex < 3) {
                console.log("fetching more docs....")
                fetchMoreTasks()?.then((new_tasks) => {
                    data.current = data.current.concat(new_tasks as any)
                    console.log("udpated task list", data.current)
                })
            }
            if ("value" in data.current[activeEntryIndex]) {
                setActiveEntryIndex(activeEntryIndex + 1);
            }
        }      
    }

    const decrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null && activeEntryIndex > 0) {
            setActiveEntryIndex(activeEntryIndex - 1);
        }  
    }

    const onSubmit = () => {
        const { hateful, islamic } = labelsToSubmit.current;

        if(hateful === null || islamic === null) 
            alert("cannot submit because null.");
        else{
            if (data.current && user && activeEntryIndex != null) {
                return Annotation.submitAnnotation({
                    headers: {
                        authorization: `Bearer ${user.token}`
                    },
                    body: {
                        value: {
                            hateful: hateful,
                            islamic: islamic
                        },
                        id: data.current[activeEntryIndex].id
                    } 
                }).then(({status}) => {
                    if (status == 200) {

                        (data.current[activeEntryIndex] as any).value = {
                            hateful: hateful,
                            islamic: islamic
                        }
                        incrementActiveEntryIndex();
                    }
                })
            }
        }
    }


    useHotkeys('enter', onSubmit);

    return (
        <div className="container px-6 lg:px-20 mx-auto mt-4"> 
        {(data.current && activeEntryIndex !== null && data.current[activeEntryIndex]) &&
            <EntryUI 
                entry={data.current[activeEntryIndex]} 
                onChange={onChange}
                onSubmit={onSubmit}
                checkDisabled={checkDisabled}
                incrementActiveEntryIndex={incrementActiveEntryIndex}
                decrementActiveEntryIndex={decrementActiveEntryIndex}
            />
        }
        </div>
     );
}
 
export default AnnotationTool;