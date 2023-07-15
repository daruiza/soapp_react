
export const ReportReducer = (state, action) => {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                collaborators: action.payload.collaborators
            }
        case 'changeInput':          

            return {
                ...state,

                // collaborators: [
                //     ...state.collaborators.filter((el, index) => index !== action.payload.index),
                //     {
                //         ...state.collaborators.find((el, index) => index == action.payload.index),
                //         [action.payload.name]: action.payload.value
                //     }
                // ]


                // collaborators: state.collaborators.map((el, index) => {
                //     return index !== action.payload.index ?
                //         el :
                //         {
                //             ...el,
                //             [action.payload.name]: action.payload.value
                //         }
                // })

                collaborators: state.collaborators.toSpliced(action.payload.index, 1,
                    {
                        ...state.collaborators[action.payload.index],
                        [action.payload.name]: action.payload.value
                    }
                )


            };

        default:
            return state;
    }
}
