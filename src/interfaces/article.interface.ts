export interface CreateArticleDto {
  title : string;
  content : string;
  imageURL : string;
  blurHash : string;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {}
