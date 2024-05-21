import { KanbanBoardContainer, KanbanBoard } from '@/components/tasks/kanban/board'
import { KanbanColumn } from '@/components/tasks/kanban/column'
import { KanbanItem } from '@/components/tasks/kanban/item'

import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { TaskStage } from '@/graphql/schema.types'
import { useList } from '@refinedev/core'
import React from 'react'


const List = () => {
    const {data: stages, isLoading: isLoadingStages} = useList({
        resource: 'taskStages',
        filters: [
            {
               field: 'title',
               operator: 'in',
               value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE' ] 
            }
        ],
        sorters: [
            {
                field: 'createdAt',
                order: 'asc'
            }
        ],
        queryOptions: {
            enabled: !!stages
        },    
        meta: {
            gqlQuery: TASK_STAGES_QUERY
        }
    })
    const {data: tasks, isLoading: isLoadingTasks} = useList({
        resource: 'tasks',
        sorters: [
            {
                field: 'dueDate',
                order: 'asc'
            }
        ],
        pagination: {
            mode: 'off'
        },
        meta: {
            gqlQuery: TASKS_QUERY
        }
        // console.log(tasks)
    })

    const taskStages = React.useMemo(()=>{
        if(!tasks?.data || !stages?.data){
            return {
                unnasignedStage: [],
                stages: [],
            }
        }

        const unnasignedStage = tasks.data.filter((task)=> task.stagedId === null)

        const grouped: TaskStage[] = stages.data.map((stage)=>({
            ...stage
        }))
    }, [stages, tasks])

  return (
    <>
        <KanbanBoardContainer>
            <KanbanBoard>
                <KanbanColumn>
                    <KanbanItem>
                        This is my first to do 
                    </KanbanItem>
                </KanbanColumn>
                <KanbanColumn>

                </KanbanColumn>
            </KanbanBoard>
        </KanbanBoardContainer>
    </>
  )
}

export default List