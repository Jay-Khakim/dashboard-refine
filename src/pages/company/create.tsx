
import { CompanyListPage } from "./list";
import { Form, Input, Modal, Select } from "antd";
import { useModalForm } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { CREATE_COMPANY_MUTATION } from "./queries";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/select-option-with-avatar";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";

const Create = () => {
    const go = useGo();

    const goToListPage = ()=>{
        go({
            to: {resource: "companies", action: "list"},
            options: {keepQuery: true},
            type: "replace"
        })
    }

    const {formProps, modalProps} = useModalForm({
        action: "create",
        defaultVisible: true,
        resource: "company",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: goToListPage,
        meta: {
            gwlMutation: CREATE_COMPANY_MUTATION
        }
    })

    const {selectProps, queryResult} = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY
        }

    })
	return(
        <CompanyListPage>
            <Modal
            {...modalProps}
            mask={true}
            onCancel={goToListPage}
            title="Create Company"
            width={512}
            >
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label="Company Name"
                        name="name"
                        rules={[{required: true}]}
                    >
                        <Input placeholder="Please enter your company name"/>
                    </Form.Item>
                    <Form.Item
                        label="Sales Owner"
                        name="salesOwnerId"
                        rules={[{required: true}]}
                    >
                        <Select 
                            placeholder="Please enter your sales owner"
                            {...selectProps}
                            options={
                                queryResult.data?.data.map((user)=>({
                                    value: user.id,
                                    label: (
                                        <SelectOptionWithAvatar
                                            name={user.name}
                                            avatarUrl={user.avatarUrl ?? undefined}
                                        />
                                    )
                                })) ?? []
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </CompanyListPage>
    ) 
    
};

export default Create;
