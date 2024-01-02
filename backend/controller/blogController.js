const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { BACKEND_SERVER_PATH } = require("../Config/index");
const BlogDTO = require("../dto/blog");
const BlogDetailsDTO = require("../dto/blog-details");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${author}.png`;

    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    let newBlog;
    try {
      newBlog = new Blog({
        title,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        author,
      });
      //   backend\storage
      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    const blogDTO = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDTO });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});

      const blogsDto = [];

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    let blog;

    const { id } = req.params;

    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    const blogDetailsDto = new BlogDetailsDTO(blog);

    return res.status(200).json({ blog: blogDetailsDto });
  },
  async update(req, res, next) {
    const updateBlogSchema = Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      blogId: Joi.string().regex(mongodbIdPattern).required(),
      photo: Joi.string(),
    });

    const { error } = updateBlogSchema.validate(req.body);

    const { title, content, author, blogId, photo } = req.body;

    // if (error) {
    //   return next(error);
    // }

    let blog;

    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = blog.photoPath;

      previousPhoto = previousPhoto.split("/").pop();
      // delete photo
      fs.unlinkSync(`storage/${previousPhoto}`);

      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${author}.png`;

      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      await Blog.updateOne({ _id: blogId }, { title, content });
    }

    return res.status(200).json({ message: "blog updated!" });
  },
  async delete(req, res, next) {
    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = deleteBlogSchema.validate(req.params);

    const { id } = req.params;

    try {
      await Blog.deleteOne({ _id: id });

      await Comment.deleteMany({ blog: id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "blog deleted!" });
  },
};

module.exports = blogController;
