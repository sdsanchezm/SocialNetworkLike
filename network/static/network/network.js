const stylePost = {
    divRow: `row pb-2`,
    divCol:  `col-12`,
    classCard:  `card`,
    classCardBody:  `card-body px-4`,
    classCardFooter:  `card-footer`,
    classCardBodyText: `text px-4`,
    classCardFooterRow: `row mx-4 px-0`,
    classCardFooterCol: `col-6 px-0`,
    classCardFooterPLeft: `text-left mb-0`,
    classCardFooterPRight: `text-right mb-0`,
    classSpanAlignMiddle: `align-middle`
}

const styleNewPost = {
    textArea: 'col-12 p-2 m-1 border-secondary'
}

function ButtonLike(props){

    let typeButton1 = 'primary';
    let text = 'unlisted'
    if (props.likeduser){
        typeButton1 = `btn btn-sm btn-outline-danger mx-1`;
        text = 'Unlike';
    }else{
        typeButton1 = `btn btn-sm btn-danger mx-1`;
        text = 'Like';
    }

    return (
            <button 
                id={props.id}
                data-postid={props.datapostid}
                className={typeButton1}
                onClick={() => {props.onClick(2121)}}
                >
                {text}
            </button>
    )
}

function ButtonFollow(props){

    const typeButton1 = `btn btn-sm btn-${props.type1} mx-1`;

    return (
            <button 
                id={props.id}
                data-postid={props.datapostid}
                className={typeButton1}
                onClick={() => {props.onClick(2121)}}
                >
                {props.text}
            </button>
    )
}

function ButtonSubmitPost(props){

    const typeButton1 = `btn btn-sm btn-${props.type1} mx-1`;

    return (
            <button 
                id={props.id}
                className={typeButton1}
                >
                {props.text}
            </button>
    )
}

function ButtonEdit(props){

    const typeButton1 = `btn btn-sm btn-${props.type1} mx-1`;

    // data-toggle="modal"
    // data-target=".bd-example-modal-lg"

    return (
            <button 
                id={props.id}
                data-postid={props.datapostid}
                className={typeButton1}
                onClick={() => {props.onClickEdit(4242)}}
                // data-bs-toggle="modal1" data-bs-target="#modal1"
                >
                {props.text}
            </button>
    )
}


function ModalEditComponent(props){

    const { seen, setSeen, editPostId, setEditPostId, postcontent } = React.useContext(EditContext1);
    const [ postContentTextArea, setPostContentTextArea] = React.useState("");

    function handleClose(e){
        e.preventDefault();
        console.log(`accessing modalTest.handleClick`);
        // props.toogle1();
        setSeen(!seen);
        console.log(`leaving modalTest.handleClick, toggled`);
    };

    function kk1(){
        console.log(`kk1 value: ${editPostId}`);
        let index1 = postcontent.map( (item) => (item.id) ).indexOf(editPostId);
        console.log(`index1: ${index1}`);
        console.log(postcontent[index1].textpost);
    };

    React.useEffect( () => {
        let index1 = postcontent.map( (item) => (item.id) ).indexOf(editPostId);
        let t1 = postcontent[index1].textpost;
        setPostContentTextArea(t1);
    }, [])


    function handleSubmitUpdate(){
        // event.preventDefault();
        console.log("starting handleSubmitUpdate");

        const textpost = postContentTextArea
        const postid = editPostId
        console.log(textpost);
    
        const url2 = `http://127.0.0.1:8000/updatepost`;
    
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Origin': '*'
            },
            body: JSON.stringify({
                "textpost": textpost,
                "postid": postid
            })
        }
    
        fetch(url2, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // clearPost();
            // document.querySelector('textarea').value = '';
            setSeen(false);
        })
    }

    // fade bd-example-modal-lg

    return (
        <div className="modal1" id="modal1" tabindex="-1"  aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
              
              <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Edit Post</h5>
  
                  <button type="button" onClick={e => handleClose(e)} className="close" data-dismiss="modal1" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
              </div>
  
              <div className="modal-body">
                  <form>
                  <div className="form-group">
                      <label for="message-text" className="col-form-label">Post Content:</label>
                      <textarea className="form-control border boder-primary" id="message-text" 
                        value={postContentTextArea} 
                        onChange={e => setPostContentTextArea(e.target.value)}>
                      </textarea>
                  </div>
                  </form>
              </div>
  
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={e => handleClose(e)} data-dismiss="modal1">Close without saving</button>
                  <button type="button" onClick={handleSubmitUpdate} className="btn btn-primary">Save Post</button>
                  {/* <button type="button" onClick={kk1} className="btn btn-primary">test</button> */}
                </div>
          </div>
        </div>
      </div>
    )
}

function Post(props){

    const { loggedUser } = React.useContext(EditContext1);

    let profilelink = "";
    if (location.pathname.split('/')[1] == `profile`){
        profilelink = `${props.authorpost}`;
    }else if(location.pathname == `/following`){
        profilelink = `profile/${props.authorpost}`;
    }else if(location.pathname == `/`){
        profilelink = `profile/${props.authorpost}`;
    }


    return (
        <div className={stylePost.divRow}>
            <div className={stylePost.divCol}>
                <div className={stylePost.classCard}>
                    <div className={stylePost.classCardBody}>
                        
                            <p className={stylePost.classCardBodyText}>{props.textpost}</p>
                        
                    </div>
                    <div className={stylePost.classCardFooter}>
                        <div className={stylePost.classCardFooterRow}>

                            <div className={stylePost.classCardFooterCol}>
                                <p className={stylePost.classCardFooterPLeft}>
                                    <span className={stylePost.classSpanAlignMiddle}><a href={profilelink} >{props.authorpost}</a> | </span>
                                    <span className={stylePost.classSpanAlignMiddle}>{props.timepost} | </span>
                                    <span className={stylePost.classSpanAlignMiddle}> {props.likecount} Likes</span>
                                </p>
                            </div>

                            <div className={stylePost.classCardFooterCol}>
                                <p className={stylePost.classCardFooterPRight}>
                                { loggedUser != props.authorpost ? null :
                                    <span><ButtonEdit onClickEdit={() => {props.onClickEdit()}} id={props.id} text={`Edit`} type1={'primary'}  /></span>
                                }
                                    <span><ButtonLike onClick={() => {props.onClick()}} id={props.id} datapostid={props.datapostid} likeduser={props.likeduser} /></span>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function PostAll(props){

    // const { editstatus, setEditstatus } = React.useContext(EditContext1);

    const postExample1 = [{
        "id": 21,
        "authorpost": "perros",
        "textpost": "hello there",
        "timepost": "Dec 15 2021, 11:11 PM"
    },
    {
        "id": 42,
        "authorpost": "sapos",
        "textpost": "mr kenobi!",
        "timepost": "Dec 5 2020, 11:12 PM"
    }]

    if (props.authorpost == ""){
        return <h1>No info</h1>
    }

    return (
        <div>
            {
                props.content.map( (item) => {
                    return <Post onClickEdit={() => {props.onClickEdit(item.id)}} 
                    onClick={() => {props.onClick(item.id)}} id={`b-${item.id}`} 
                    datapostid={item.id} textpost={item.textpost} authorpost={item.authorpost} timepost={item.timepost} 
                    likecount={item.likecount} likeduser={item.likeduser} />
                })
            }
        </div>
    )
}

function Profile(props){

    return (
        <div className="row pb-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-body px-4 mx-4">
                        <p>
                            <span className="align-middle display-4">{props.username}  </span>
                            <ButtonFollow text={`Follow`} type1={'success'} />
                        </p>
                        <p>
                            <span> Followers: 21 |</span>
                            <span> Following: 21</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function NewPost(props){
    return (
        <div className={`row pb-3`}>
            <div className={`col-12`}>
                <div className={`card`}>
                    <div className={`card-body`}>
                        <form onSubmit={ e => props.onSubmit(e) }>
                            <p className={`pt-4 px-4 mb-0 pb-0`}>
                                <textarea max="300" value={props.newpostfromtextarea} onChange={ e => props.onChange(e)} className={styleNewPost.textArea} >
                                    {props.newpostfromtextarea}
                                </textarea>
                            </p>
                            <p className="text-right pt-1 m-1 pr-3 pt-0">
                                <ButtonSubmitPost type="button" text={`Post`} type1={'success'} />
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

function handleSubmit1(event){
    event.preventDefault();
    console.log("starting handleSubmit");

    const t1 = { t2 };

    const url1 = `http://127.0.0.1:8000/test`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Origin': '*'
        },
        // body: JSON.stringify({ textpost: "this is another"})
        body: JSON.stringify(t1)
    }

    fetch(url1, requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

}

function get1(){
    const url1 = `http://127.0.0.1:8000/posts/test`;

    fetch(url1)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

function post1(){
    const url1 = `http://127.0.0.1:8000/posts/test`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Origin': '*'
        },
        body: JSON.stringify({ textpost: "this is a text test"})
    }

    fetch(url1, requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

function AlertSuccess(){

    return (
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>yay!</strong> Post was sent.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">X</span>
        </button>
        </div>
    )
};

function x1(){
    return(
        <h1>this is x1</h1>
    )
}

function x2(){
    return(
        <h1>this is x2</h1>
    )
}

function Paginationx(props){

    const { actualPage } = React.useContext(PaginationContext1);

    const maxnum = Math.ceil(props.maxpost / props.rpp);

    let paginationvar = [];
    let i = 0;
    for (i = 1; i<=maxnum; i++){
        paginationvar.push(i);
    }

    return(
        <div>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    {actualPage == 1? <div></div> : 
                    <li className="page-item"><a className="page-link" onClick={() => {props.previouspage()}}  >Previous</a></li>
                    }

                    {
                        paginationvar.map( (item) => {
                            return <li className="page-item"><a onClick={() => props.gotoPage(item)} className="page-link" >{item}</a></li>
                        })
                    }
                    
                    {actualPage == maxnum? <div></div> : 
                    <li className="page-item"><a onClick={() => {props.nextpage()}} className="page-link"  >Next</a></li>
                    }
                </ul>
            </nav>
        </div>
    )
}


    const EditContext1 = React.createContext({});
    const PaginationContext1 = React.createContext({});

// Main component ======================================================
function TheWholeThing()
{

    const [textpost, setTextpost] = React.useState("");
    const [postcontent, setPostcontent] = React.useState([]);
    const [postfollowing, setPostfollowing] = React.useState([]);
    const [actualPage, setActualPage] = React.useState(1);
    const [recordsPerPage, setRecordsPerPage] = React.useState(10);
    const [editPostId, setEditPostId] = React.useState(-1);
    const [seen, setSeen] = React.useState(false);
    const [loggedUser, setLoggedUser] = React.useState("");

    // React.useEffect( () => {
    //     const url1 = `http://127.0.0.1:8000/test`;
    
    //     fetch(url1)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         setTextpost("qweqwe")
    //     });
    // }, []);

    function ax1(data){
        setPostcontent(data);
    }

    const postExample1 = [{
        "id": 21,
        "authorpost": "perros",
        "textpost": "hello there",
        "timepost": "Dec 15 2021, 11:11 PM"
    },
    {
        "id": 42,
        "authorpost": "sapos",
        "textpost": "mr kenobi!",
        "timepost": "Dec 5 2020, 11:12 PM"
    }]

    React.useEffect(() => {
        const varx = 1;
        // debugger
        console.log(`location 1: ${location.pathname}`);

        getAllPost(location.pathname);
        console.log(`useEffect accessed`);
        // debugger
        getLoggedUser();
        // console.log(`lu3: ${loggedUser}`);
        // debugger
        
        // console.log(`user test: ${request.user.username}`);
        
        // getAllPost('posts/all');
        // console.log(`location: ${location}`);
        // console.log(`location.host: ${location.host}`);
        // console.log(`location.hostname: ${location.hostname}`);
        // console.log(`location.pathname: ${location.pathname}`);
      }, [location.pathname, seen]);


    function clearPost(){
        setTextpost("");
        // document.querySelector('textarea').value = '';
    }

    function getLoggedUser(){
        fetch('http://127.0.0.1:8000/getloggeduser')
        .then(response => response.json())
        .then(data => {
            const u1 = data.loggeduser1;
            console.log(`lu1: ${u1}`);
            setLoggedUser(u1);
            console.log(`lu2: ${loggedUser}`);
        })
    }

    // let content1 = '';

    let totalPages = 0;
    let lastIndex = 0;
    let initialIndex = 0;
    // let slicedContentAllPosts = [];

    const getAllPost = (endpoint1) => {
        console.log("starting getAllPost");
        console.log(`endpoint1: ${endpoint1}`);
        let path1 = location.pathname.split('/');
        console.log(`path1: ${path1[1]}`);
        console.log(`path2: ${path1[2]}`);
        console.log(`endpointTest: ${location.pathname}`);
    
        // const url2 = `http://127.0.0.1:8000${endpoint1}`;
        // console.log(`url2: ${url2}`);
        // fetch(url2)
        // .then(response => response.json())
        // .then(data => {
        //     console.log(`data: ${data}`);
        //     setPostcontent(data);
        // })
        const u1 = path1[2];

            if (endpoint1 == '/'){
                // getAllPost('/posts/all');
                const url2 = `http://127.0.0.1:8000/posts/all`;
                console.log(`url2: ${url2}`);
                fetch(url2)
                .then(response => response.json())
                .then(data => {
                    console.log(`data from fetch: ${data}`);
                    // debugger
                    // ax1(data);
                    setPostcontent(data);
                    console.log("end of setPostcontent 1");
                    // debugger
                })
            }
            
            else if (path1[1] == 'profile'){
                // getAllPost('/posts/all');
                const url2 = `http://127.0.0.1:8000/post/${u1}`;
                console.log(`url2: ${url2}`);
                fetch(url2)
                .then(response => response.json())
                .then(data => {
                    console.log(`data from fetch: ${data}`);
                    // debugger
                    // ax1(data);
                    setPostcontent(data);
                    console.log("end of setPostcontent 2");
                    // debugger
                })
            }

            else if (endpoint1 == '/following'){
                // getAllPost('/posts/all');
                const url2 = `http://127.0.0.1:8000/getpostsfollowing`;
                console.log(`url2: ${url2}`);
                fetch(url2)
                .then(response => response.json())
                .then(data => {
                    console.log(`data from fetch: ${data}`);
                    // debugger
                    // ax1(data);
                    setPostcontent(data);
                    console.log("end of setPostcontent 3");
                    // debugger
                })
            }
 
            
            // else if (endpoint1 == `/profile/${user1}`){
            //     // getAllPost('/posts/all');
            //     const url2 = `http://127.0.0.1:8000/getprofile/${user1}`;
            //     console.log(`url2: ${url2}`);
            //     fetch(url2)
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(`data from fetch: ${data}`);
            //         // debugger
            //         // ax1(data);
            //         setPostcontent(data);
            //         console.log("end of setPostcontent 2");
            //         // debugger
            //     })
            // }
        }
        
        

        totalPages = Math.ceil(postcontent.length / recordsPerPage);
        lastIndex = actualPage * recordsPerPage;
        initialIndex = lastIndex - recordsPerPage;
        const slicedContentAllPosts = postcontent.slice(initialIndex, lastIndex);

    // const getAllProfile = () => {
    //     console.log("starting getAllPost");
    
    //     const url2 = `http://127.0.0.1:8000/getprofile/${profilename}`;
    //     let xx = "";
    //     fetch(url2)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(`data: ${data}`);
    //         setPostcontent(data);
    //     })
    //     // return xx;
    // }

    const getAllFollowing = () => {
        console.log("starting getAllFollowing");
    
        const url2 = `http://127.0.0.1:8000/posts/all`;
        fetch(url2)
        .then(response => response.json())
        .then(data => {
            console.log(`data: ${data}`);
            setPostfollowing(data);
        })
    }


    function getLocation(){
        console.log(`location: ${location}`);
    }

    function handleSubmit2(event){
        // event.preventDefault();
        console.log("starting handleSubmit");

        console.log(textpost);
    
        const url1 = `http://127.0.0.1:8000/posts/test`;
        const url2 = `http://127.0.0.1:8000/posts/create`;
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                // 'Connection': 'keep-alive',
                'Origin': '*'
            },
            // body: JSON.stringify({ textpost: "this is another"})
            body: JSON.stringify({"textpost": textpost})
        }
    
        fetch(url2, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            clearPost();
            // document.querySelector('textarea').value = '';
            
        })
    }


    function handleLike1(nx){
        // event.preventDefault();
        console.log(`starting handleLike1 on id: ${nx}`);
    
        const url2 = `http://127.0.0.1:8000/likepost`;
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                // 'Connection': 'keep-alive',
                'Origin': '*'
            },
            // body: JSON.stringify({ textpost: "this is another"})
            body: JSON.stringify({"postid": nx})
        }
    
        fetch(url2, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(`Response after like: ${data}`);
            getAllPost(location.pathname);
        })
    }

    
    const postExample2 = [{
        "id": 63,
        "authorpost": "darth vader",
        "textpost": "hello there",
        "timepost": "Dec 15 2021, 11:11 PM"
    },
    {
        "id": 84,
        "authorpost": "jamecho",
        "textpost": "mr kenobi!",
        "timepost": "Dec 5 2020, 11:12 PM"
    }];

    // console.log(`content1: ${content1}`);

    // Pagination calculation
    // const totalPages = Math.ceil(postcontent.length / recordsPerPage);
    // const lastIndex = actualPage * recordsPerPage;
    // const initialIndex = lastIndex - recordsPerPage;

    // console.log(`total post: ${postcontent.length}`);
    // console.log(`totalPages: ${totalPages}`);
    // console.log(`initialIndex: ${initialIndex}`);
    // console.log(`lastIndex: ${lastIndex}`);
    // console.log(`actualPage: ${actualPage}`);

    // Slide post for /post/all
    // const slicedContentAllPosts = postcontent.slice(initialIndex, lastIndex);

    // Slide post for /post/following
    // const postfollowingSliced = postcontent.slice(initialIndex, lastIndex);

    function nextpage(){
        // e.preventDefault();
        // debugger
        setActualPage(actualPage+1);
        console.log("this is nextpage");
    }

    function previouspage(){
        // e.preventDefault();
        setActualPage(actualPage-1);
        console.log("this is previouspage");
    }

    function gotoPage(n){
        setActualPage(n);
    }

    function likepost(idx){
        console.log(`clicking Like button number: ${idx}`)
        handleLike1(idx);
    }

    // Edit Function 1 ==================
    function editpost(idEdit){
        console.log(`clicking Edit button number: ${idEdit}`)
        // setEditstatus(true);
        setSeen(!seen);
        setEditPostId(idEdit);
        // console.log(`editstatus changing...`)
        // setEditstatus(false);
    }
    // Edit Function 2 ==================
    function handleEdit(event){
        event.preventDefault();
        setUpdateState(false);
    }

    
    function toogle1(){
        console.log(`starting toogle1 ${seen}`);
        setSeen(!seen);
        console.log(`ending toogle1 ${seen}`);
    }

    function followingbutton(idEdit){
        console.log(`clicking Edit button number: ${idEdit}`)
    }



    if (location.pathname == '/'){
        return (
            <div>
                <NewPost newpostfromtextarea={textpost} onChange={ e => setTextpost(e.target.value)} value={textpost} onSubmit={(e) => { handleSubmit2(e) }} />
                <PostAll content={slicedContentAllPosts} onClick={(idx) => likepost(idx)} />
                <PaginationContext1.Provider value={{actualPage}}>
                    <Paginationx gotoPage={(n) => gotoPage(n)} nextpage={nextpage} previouspage={previouspage} rpp={recordsPerPage} maxpost={postcontent.length} />
                </PaginationContext1.Provider>
            </div>
        )
    }

    if (location.pathname == '/following'){
        return (
            <div>
                <h1>Following</h1>
                <PostAll content={slicedContentAllPosts} onClick={(idx) => likepost(idx)} />
                <PaginationContext1.Provider value={{actualPage}}>
                    <Paginationx gotoPage={(n) => gotoPage(n)} nextpage={nextpage} previouspage={previouspage} rpp={recordsPerPage} maxpost={postcontent.length} />
                </PaginationContext1.Provider>
            </div>
        )
    }


    if (location.pathname.split('/')[1] == `profile`){
        return (
            <div>
                <EditContext1.Provider value={{ seen, setSeen, editPostId, setEditPostId, postcontent, loggedUser }}>
                { seen ? <ModalEditComponent toggle1={toogle1} /> : 
                    <PostAll onClickEdit={(idEdit) => editpost(idEdit)} onClick={(idx) => likepost(idx)}
                    content={slicedContentAllPosts} />
                }
                </EditContext1.Provider>
                <PaginationContext1.Provider value={{actualPage}}>
                    <Paginationx gotoPage={(n) => gotoPage(n)} nextpage={nextpage} previouspage={previouspage} rpp={recordsPerPage} maxpost={postcontent.length} />
                </PaginationContext1.Provider>
            </div>
        )
    }



    return (
        <div>

        <button onClick={get1}>GET</button>
        <button onClick={post1}>POST</button>
        <button onClick={clearPost}>CLEAR</button>
        <button onClick={getLocation}>Getlocation</button>
            
        </div>
    )

}


console.log("the end of the network.js file, before render");

let x3 = document.querySelector('#app');
ReactDOM.render(<TheWholeThing />, x3);



