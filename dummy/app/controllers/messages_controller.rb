class MessagesController < ApplicationController

  before_action :set_user
  def index
  end

  def create
    UserChannel[@user].store('messages').merge([params[:message]])
    UserChannel[@user].store('records').upsert([{id: 1, name: "new"}, {id: 2, name: "new"}])
  end

  private
  def set_user
    @user = User.where(id: 1).first_or_create!(name: "henlo")
  end
end

