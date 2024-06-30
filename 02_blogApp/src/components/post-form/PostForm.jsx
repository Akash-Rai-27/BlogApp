import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        console.log("Check what is post if-part",post)
        // console.log("Check what is postfeatured image",post.featuredImage)
        console.log("this is data passed to the post form on submit ::",data)
        
        if (post) {

            console.log("checking for the post if -- updation ::", post)

            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
            console.log("what is data.image", data.image[0])
            console.log("what is the file :: ",file)
            console.log("The file has image which is being updated ::")
                //&& post.featuredImage -- added part
            if (file && post.featuredImage) {
                //added await
                const deleteFile = await appwriteService.deleteFile(post.featuredImage);
                console.log("File is being deleted ::", deleteFile)
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });
            console.log("this is updated post dbpost :",dbPost)

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            console.log("first check what is post-props :: else part", post)

            console.log("what are data passed here::",data)
            if(data){
                console.log("checking featured Image before hand",data.featuredImage)
            }
            // console.log("Check what is postfeatured image",post.featuredImage)
            

            const file = await appwriteService.uploadFile(data.image[0]);
            console.log("THis is postform else part-- create ::file uploading image ::",file)

            if (file) {
                const fileId = file.$id;
                console.log("waht is fileId here from file.$id which will be our featuredImage",fileId)
                data.featuredImage = fileId;

                console.log("checking after upload file featured image", data.featuredImage)

                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });
                console.log("what is dbPost after creation of post :: ",dbPost);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
