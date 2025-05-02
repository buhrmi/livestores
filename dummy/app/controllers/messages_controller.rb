class MessagesController < ApplicationController

  before_action :set_user
  def index
  end

  def create
    UserChannel[@user].store('messages').merge([params[:message]])
    UserChannel[@user].store('records').upsert([{id: 1, name: "new"}, {id: 2, name: "new"}])
    UserChannel[@user].store('large_number').keepLarger(value: 500)
    UserChannel[@user].store('large_number').keepLarger(value: 1000)
    UserChannel[@user].store('large_number').keepLarger(value: 800)
  end

  private
  def set_user
    @user = User.where(id: 1).first_or_create!(name: "henlo")
  end
end

