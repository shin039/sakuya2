from abc                  import ABCMeta, abstractmethod

# ------------------------------------------------------------------------------
# Each Vendor's Interface Class
# ------------------------------------------------------------------------------
class I_DbVendor(metaclass=ABCMeta):

  # ----------------------------------------------------------------------------
  # Class Variable
  # ----------------------------------------------------------------------------
  MODE_REGIST = 1
  MODE_UPDATE = 2
  MODE_DELETE = 3
  
  # ----------------------------------------------------------------------------
  # Abstrat Method
  # ----------------------------------------------------------------------------
  @abstractmethod
  def select(self, query, tp_param):
    raise NotImplementedError()

  @abstractmethod
  def insert(self, query, tp_param, staff_id):
    raise NotImplementedError()

  @abstractmethod
  def update(self, query, tp_param, staff_id):
    raise NotImplementedError()

  @abstractmethod
  def delete(self, query, tp_param, staff_id):
    raise NotImplementedError()

  # NOTE: 継承先のクラスにてTransactionLogの書き込み処理を忘れないようにしたいので、
  #       あえてAbstractクラスにして残している。
  @abstractmethod
  def _insertTransactionlog(self, query, tp_param, staff_id):
    raise NotImplementedError()

